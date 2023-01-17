import { PartialDeep } from 'type-fest';

export const EVENT_OBJECT = 'event';

export interface EventData<T = any> {
  object: T;
  previous_attributes?: PartialDeep<T>;
}

export interface Event<T = any> {
  id?: string;
  object: string;
  created: Date;
  data: T;
  source: string;
  type: string;
  environment: string;
}
