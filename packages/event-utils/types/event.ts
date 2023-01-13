import { PartialDeep } from 'type-fest';
import { EventType } from './event-type';

export const EVENT_OBJECT = 'event';

export interface EventData<T = any> {
  object: T;
  previous_attributes?: PartialDeep<T>;
}

export interface Event<T = any> {
  object: string;
  created: Date;
  data: T;
  source: string;
  type: EventType;
  environment: string;
}
