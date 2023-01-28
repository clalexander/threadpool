import { NotFoundApiError } from 'api-client';
import { eventbridgeEventBodyParser, SQSHandler } from 'aws-utils';
import { Event, publishEvent } from 'event-utils';
import { Printful, printful, WebhookSetup } from 'printful';
import { PrintfulWebhookConfig } from 'types';
import { TARGET_EVENTBRIDGE_ARN } from './constants';
import { getWebhookURL } from './utils';

const handleSetupWebhook = async (client: Printful, storeId: number) => {
  const url = await getWebhookURL();
  const info: WebhookSetup = {
    url,
    types: [
      'package_shipped',
    ],
  };
  await client.webhooks.setup(storeId, info);
};

const handleDisableWebhook = async (client: Printful, storeId: number) => {
  try {
    await client.webhooks.disable(storeId);
  } catch (error: any) {
    switch (error.constructor) {
      case NotFoundApiError:
        // do nothing for this error
        break;
      default:
        // throw all other errors
        throw error;
    }
  }
};

const eventHandler = async (event: Event<PrintfulWebhookConfig>) => {
  const { type, data: config } = event;
  const { store_id: storeId } = config;
  const client = await printful();
  switch (type) {
    case 'printful_webhook_config.create':
      await handleSetupWebhook(client, storeId);
      break;
    case 'printful_webhook_config.disable':
      await handleDisableWebhook(client, storeId);
      break;
    default:
      throw new Error(`Unexpected event type: ${type}`);
  }
};

const errorHandler = async (error: any) => {
  // lifecycle: service failed
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: 'service.printful_webhook_manager.failed',
    data: error,
  });
  return false;
};

export const handler = SQSHandler(eventHandler, {
  bodyParser: eventbridgeEventBodyParser,
  errorHandler,
});
