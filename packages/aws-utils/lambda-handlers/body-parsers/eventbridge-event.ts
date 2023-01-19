import { EventBridgeEvent } from 'aws-lambda';
import { Event } from 'event-utils';
import { defaultBodyParser } from './default';

export const eventbridgeEventBodyParser = <T>(body: string): Event<T> => {
  const data = defaultBodyParser<EventBridgeEvent<string, Event<T>>>(body);
  return data.detail;
};
