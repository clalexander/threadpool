import { ApiClient } from 'api-client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { convertDateStrings } from 'utils';
import { INKSOFT_API_BASE_URL } from './constants';
import modules from './modules';
import { AdditionalRequestOptions } from './types';
import { serialize } from './utils';

export interface InkSoftOptions {
  APIKey: string;
}

export class InkSoft extends ApiClient(modules) {
  private APIKey: string;

  constructor({ APIKey }: InkSoftOptions) {
    super({
      baseURL: INKSOFT_API_BASE_URL,
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
