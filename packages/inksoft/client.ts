import { ApiClient } from 'api-client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { convertDateStrings } from 'utils';
import modules from './modules';
import { AdditionalRequestOptions } from './types';
import { serialize } from './utils';

export interface InkSoftOptions {
  baseURL: string;
  APIKey: string;
}

export class InkSoft extends ApiClient(modules) {
  private APIKey: string;

  constructor({ baseURL, APIKey }: InkSoftOptions) {
    super({
      baseURL,
      paramsSerializer: {
        serialize,
      },
    });
    this.APIKey = APIKey;
  }

  protected requestInterceptor(
    request: AxiosRequestConfig & AdditionalRequestOptions,
  ): AxiosRequestConfig {
    const { omitApiKey, ...remainingOptions } = request;
    const newRequest = { ...remainingOptions };
    let data = newRequest.method === 'GET' || newRequest.method === 'get'
      ? newRequest.params
      : newRequest.data;
    if (!omitApiKey) {
      data = {
        ...(data || {}),
        APIKey: this.APIKey,
      };
    }
    if (newRequest.method === 'GET' || newRequest.method === 'get') {
      newRequest.params = data;
    } else {
      // HERE may need to serialize the data
      newRequest.data = data;
    }
    return newRequest;
  }

  protected responseInterceptor(response: AxiosResponse): AxiosResponse {
    return {
      ...response,
      data: convertDateStrings(response.data),
    };
  }
}
