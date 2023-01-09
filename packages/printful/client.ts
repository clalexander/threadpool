import {
  ApiClient,
  buildBearerAuthHeader,
} from 'api-client';
import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { PRINTFUL_API_BASE_URL } from './constants';
import modules from './modules';
import { AdditionalRequestOptions } from './types';

export interface PrintfulOptions {
  token: string;
}

export class Printful extends ApiClient(modules) {
  constructor({ token }: PrintfulOptions) {
    super({
      baseURL: PRINTFUL_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: buildBearerAuthHeader(token),
      },
    });
  }

  protected requestInterceptor(
    request: AxiosRequestConfig & AdditionalRequestOptions,
  ): AxiosRequestConfig {
    const { storeId, ...remainingOptions } = request;
    if (storeId) {
      return {
        ...remainingOptions,
        headers: {
          ...(remainingOptions.headers || {}) as RawAxiosRequestHeaders,
          'X-PF-Store-Id': storeId,
        },
      };
    }
    return request;
  }
}
