import { ApiModule, ApiResource } from 'api-client';
import { AdditionalRequestOptions } from './request';

export type PrintfulApiModule<T extends ApiResource> = ApiModule<T, AdditionalRequestOptions>;
