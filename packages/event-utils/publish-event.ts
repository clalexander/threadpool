import { EventBridge } from 'aws-sdk';
import { aws } from 'aws-utils';
import { envName } from 'utils';
import { Event, EVENT_OBJECT } from './types';

export const DEFAULT_EVENT_SOURCE = 'threadpool';
export const BATCH_SIZE = 10;

const eventbridge = aws().eventbridge();

export interface PublishEventOptions {
  bus: string;
  type: string;
  data?: any | any[];
  source?: string;
  publishSeparateEvents?: boolean;
}

function makeEvent<T>(data: T, source: string, type: string): Event<T> {
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

export const publishEvent = async ({
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
  const promises: Promise<any>[] = [];
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const entriesChunk = entries.slice(i, i + BATCH_SIZE);
    const params = {
      Entries: entriesChunk,
    };
    const request = eventbridge.putEvents(params);
    promises.push(request.promise());
  }
  await Promise.all(promises);
};
