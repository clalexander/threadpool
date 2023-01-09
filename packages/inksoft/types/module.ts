import { ApiModule, ApiResource } from 'api-client';
import { AdditionalRequestOptions } from './request';

export type InkSoftApiModule<T extends ApiResource> = ApiModule<T, AdditionalRequestOptions>;
