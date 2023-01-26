/* eslint-disable max-classes-per-file */
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  Method,
} from 'axios';
import { Promisable } from 'type-fest';
import { Constructor } from 'types';
import {
  ApiError,
  BadGatewayApiError,
  GatewayTimeoutApiError,
  InternalServerApiError,
  NetworkApiError,
  TimeoutApiError,
  UnauthorizedApiError,
} from './error';
import { paramsSerializer } from './utils';

export interface ApiRequestOptions extends Pick<AxiosRequestConfig, 'params' | 'data' | 'headers'> {
  method: Method;
  path?: unknown | unknown[],
  preventAuthRefresh?: boolean;
  preventRetry?: boolean;
  retries?: number;
}

export type ApiMakeRequest<T = any, O = any> = (options: ApiRequestOptions & O) => Promisable<T>;

export interface ApiModuleMethodsOptions<O = any> {
  makeRequest: ApiMakeRequest<any, O>;
}

export type ApiResource = Record<string, any>;
export type ApiResources = Record<string, ApiResource>;

export type ApiModule<T extends ApiResource, O = any> = {
  path?: string;
  methods: (options: ApiModuleMethodsOptions<O>) => T;
};

export type ApiModules<T extends ApiResources> = {
  [K in keyof T]: ApiModule<T[K]>;
};

type UnwrapApiResources<T> = T extends ApiModules<infer Type> ? Type : never;

export interface ApiClientOptions extends CreateAxiosDefaults {
  maxRetries?: number;
}

class ApiClientBase {
  protected client: AxiosInstance;

  protected maxRetries: number;

  constructor({ maxRetries, ...axiosCreateOptions }: ApiClientOptions) {
    this.client = axios.create({
      paramsSerializer: {
        serialize: paramsSerializer,
      },
      ...axiosCreateOptions,
    });
    this.maxRetries = maxRetries || 0;
    // eslint-disable-next-line no-underscore-dangle
    this.client.interceptors.request.use(this._requestInterceptor);
    this.client.interceptors.response.use(
      // eslint-disable-next-line no-underscore-dangle
      this._responseInterceptor,
      // eslint-disable-next-line no-underscore-dangle
      this._responseErrorInterceptor,
    );
  }

  protected requestInterceptor(request: AxiosRequestConfig): AxiosRequestConfig {
    return request;
  }

  private _requestInterceptor = (request: AxiosRequestConfig) => this.requestInterceptor(request);

  protected responseInterceptor(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private _responseInterceptor = (response: AxiosResponse) => this.responseInterceptor(response);

  protected async responseErrorInterceptor(error: AxiosError): Promise<any> {
    const config = ({ ...error.config }) as ApiRequestOptions;
    let maybeRetry = false;
    const apiError = ApiError.generate(error);
    switch (apiError.constructor) {
      case UnauthorizedApiError:
        // maybe refresh auth and retry request
        if (!config.preventAuthRefresh) {
          const refreshedConfig = await this.tryRefreshAuth(config);
          if (refreshedConfig) {
            return this.client(refreshedConfig);
          }
        }
        break;
      case InternalServerApiError:
      case BadGatewayApiError:
      case GatewayTimeoutApiError:
      case NetworkApiError:
      case TimeoutApiError:
        maybeRetry = true;
        break;
      default:
        break;
    }
    // retry flag
    const retry = maybeRetry && !config.preventRetry && (config.retries || 0) < this.maxRetries;
    // maybe retry request
    if (retry) {
      // update config
      const retryConfig = {
        ...config,
        retries: config.retries || 1,
      };
      // retry
      return this.client(retryConfig);
    }
    // throw error
    throw apiError;
  }

  private _responseErrorInterceptor = (error: any) => this.responseErrorInterceptor(error);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async tryRefreshAuth(config: ApiRequestOptions): Promise<ApiRequestOptions | null> {
    // override to refresh auth
    return null;
  }

  protected async makeRequest<T>(options: ApiRequestOptions, baseBath?: string): Promise<T> {
    const { path, ...remainingOptions } = options;
    const url = this.buildPath(path, baseBath);
    const requestOptions = {
      ...remainingOptions,
      url,
    };
    const response = await this.client.request(requestOptions);
    return response.data;
  }

  protected buildPath(path?: unknown | unknown[], basePath?: string): string {
    const pathParts = path ? (Array.isArray(path) ? path : [path]) : [];
    if (basePath) {
      pathParts.unshift(basePath);
    }
    return pathParts.join('/');
  }

  protected resourceMakeRequest(path?: string): ApiMakeRequest {
    return (options: ApiRequestOptions) => this.makeRequest(options, path);
  }

  protected makeResource<T extends ApiResource>(module: ApiModule<T>): T {
    return module.methods({
      makeRequest: this.resourceMakeRequest(module.path),
    });
  }
}

export function ApiClient<T extends ApiModules<ApiResources>>(
  modules: T,
) {
  abstract class Class extends ApiClientBase {
    constructor(options: ApiClientOptions) {
      super(options);
      const resources = Object.entries(modules).reduce((acc, [key, module]) => ({
        ...acc,
        [key]: this.makeResource(module),
      }), {});
      Object.assign(this, resources);
    }
  }
  return Class as Constructor<ApiClientBase & UnwrapApiResources<T>, ApiClientOptions>;
}
