import { EventBridgeEvent } from 'aws-lambda';
import { SQSHandler } from 'aws-utils';
import { SummaryEventsData } from 'data-stores';
import { Event } from 'event-utils';
import { EVENT_TTL, SUMMARY_EVENTS_TABLE_NAME } from './constants';

const summaryEventsData = new SummaryEventsData(SUMMARY_EVENTS_TABLE_NAME, EVENT_TTL);

const eventHandler = async (ebEvent: EventBridgeEvent<string, Event>) => {
  const { id, detail } = ebEvent;
  const event = {
    ...detail,
    id,
  };
  await summaryEventsData.putItem(event);
};

export const handler = SQSHandler(eventHandler);
