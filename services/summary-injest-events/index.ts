import { EventBridgeEvent } from 'aws-lambda';
import { SQSHandler } from 'aws-utils';
import { Event } from 'event-utils';
import { getEventTTL } from './parameters';
import { getSummaryEventsData } from './utils';

const eventHandler = async (ebEvent: EventBridgeEvent<string, Event>) => {
  const eventTTL = await getEventTTL();
  const summaryEventsData = getSummaryEventsData(eventTTL);
  const { id, detail } = ebEvent;
  const event = {
    ...detail,
    id,
  };
  await summaryEventsData.putItem(event);
};

export const handler = SQSHandler(eventHandler);
