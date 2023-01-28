import { eventbridgeEventBodyParser, SQSHandler } from 'aws-utils';
import { Event, publishEvent } from 'event-utils';
import { StoresMapRecordMutation } from 'types';
import { TARGET_EVENTBRIDGE_ARN } from './constants';
import { makePrinfulWebhookConfig } from './utils';

const eventHandler = async (event: Event<StoresMapRecordMutation>) => {
  const { type, data } = event;
  const {
    newRecord: newStoresMap,
    oldRecord: oldStoresMap,
  } = data;
  switch (type) {
    case 'stores_map.created':
      if (!newStoresMap) {
        throw new Error('Missing newRecord for created event');
      }
      await publishEvent({
        bus: TARGET_EVENTBRIDGE_ARN,
        type: 'printful_webhook_config.create',
        data: makePrinfulWebhookConfig(newStoresMap),
      });
      break;
    case 'stores_map.updated':
      if (!newStoresMap) {
        throw new Error('Missing newRecord for updated event');
      }
      if (!oldStoresMap) {
        throw new Error('Missing oldRecord for updated event');
      }
      // check that the printful store ids have changed
      if (newStoresMap.printful_store_id === oldStoresMap.printful_store_id) {
        break;
      }
      // send an update event for both create and update events
      await publishEvent({
        bus: TARGET_EVENTBRIDGE_ARN,
        type: 'printful_webhook_config.create',
        data: makePrinfulWebhookConfig(newStoresMap),
      });
      await publishEvent({
        bus: TARGET_EVENTBRIDGE_ARN,
        type: 'printful_webhook_config.disable',
        data: makePrinfulWebhookConfig(oldStoresMap),
      });
      break;
    case 'stores_map.deleted':
      if (!oldStoresMap) {
        throw new Error('Missing oldRecord for deleted event');
      }
      await publishEvent({
        bus: TARGET_EVENTBRIDGE_ARN,
        type: 'printful_webhook_config.disable',
        data: makePrinfulWebhookConfig(oldStoresMap),
      });
      break;
    default:
      throw new Error(`Unexpected event type: ${type}`);
  }
};

const errorHandler = async (error: any) => {
  // lifecycle: service failed
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: 'service.stores_map_translator.failed',
    data: error,
  });
  return false;
};

export const handler = SQSHandler(eventHandler, {
  bodyParser: eventbridgeEventBodyParser,
  errorHandler,
});
