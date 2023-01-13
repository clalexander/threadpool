import { EventBridge } from 'aws-sdk';
import { aws } from 'aws-utils';
import { envName } from 'utils';
import { Event, EventType, EVENT_OBJECT } from './types';

export const DEFAULT_EVENT_SOURCE = 'com.threadpool';

const eventbridge = aws().eventbridge();

export interface PublishEventOptions {
  bus: string;
  type: EventType;
  data?: any | any[];
  source?: string;
  publishSeparateEvents?: boolean;
}

function makeEvent<T>(data: T, source: string, type: EventType): Event<T> {
  const environment = envName();
  return {
    object: EVENT_OBJECT,
    created: new Date(),
    data,
    source,
    type,
    environment,
  };
}

export const publishEvent = ({
  bus,
  type,
  source,
  data,
  publishSeparateEvents,
}: PublishEventOptions) => {
  const eventSource = source || DEFAULT_EVENT_SOURCE;
  const baseEntryParams: EventBridge.Types.PutEventsRequestEntry = {
    DetailType: type,
    EventBusName: bus.split('/')[1],
    Source: eventSource,
  };
  let entries: EventBridge.Types.PutEventsRequestEntryList;
  if (data) {
    if (Array.isArray(data) && publishSeparateEvents) {
      entries = data.map((value) => ({
        ...baseEntryParams,
        Detail: JSON.stringify(makeEvent(value, eventSource, type)),
      }));
    } else {
      entries = [{
        ...baseEntryParams,
        Detail: JSON.stringify(makeEvent(data, eventSource, type)),
      }];
    }
  } else {
    entries = [{
      ...baseEntryParams,
      Detail: JSON.stringify(makeEvent({}, eventSource, type)),
    }];
  }
  const params = {
    Entries: entries,
  };
  const request = eventbridge.putEvents(params);
  return request.promise();
};
