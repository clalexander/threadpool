import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { APIGatewayHandler } from 'aws-utils';
import { publishEvent } from 'event-utils';
import { WebhookEvent } from 'printful';
import { PRINTFUL_EVENT_SOURCE, TARGET_EVENTBRIDGE_ARN } from './constants';
import { isRequestAuthorized } from './utils';

const eventHandler = async (
  data: WebhookEvent | null,
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  // check authorization
  const isAuthorized = await isRequestAuthorized(event);
  if (!isAuthorized) {
    await publishEvent({
      bus: TARGET_EVENTBRIDGE_ARN,
      type: 'service.printful_webhook.received_unauthorized_request',
    });
    return {
      statusCode: 403,
      body: 'Unauthorized',
    };
  }
  // publish webhook event
  if (data) {
    const { type } = data;
    await publishEvent({
      bus: TARGET_EVENTBRIDGE_ARN,
      source: PRINTFUL_EVENT_SOURCE,
      type,
      data,
    });
  } else {
    await publishEvent({
      bus: TARGET_EVENTBRIDGE_ARN,
      type: 'service.printful_webhook.received_invalid_event',
    });
    return {
      statusCode: 400,
      body: 'Bad request',
    };
  }
  // return accepted response
  return {
    statusCode: 200,
    body: 'Accepted',
  };
};

const errorHandler = async (error: any) => {
  // lifecycle: service failed
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: 'service.printful_webhook.failed',
    data: error,
  });
  return null;
};

export const handler = APIGatewayHandler(eventHandler, { errorHandler });
