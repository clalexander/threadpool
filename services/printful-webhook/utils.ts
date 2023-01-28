import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { makeRedact } from 'utils';
import { WEBHOOK_TOKEN_QUERY_PARAM } from './constants';
import { eventRedactPaths } from './redact-paths';
import { getWebhookToken } from './token';

export const isRequestAuthorized = async (event: APIGatewayProxyEventV2): Promise<boolean> => {
  const token = await getWebhookToken();
  const eventToken = event.queryStringParameters?.[WEBHOOK_TOKEN_QUERY_PARAM];
  return token === eventToken;
};

export const eventRedact = makeRedact(eventRedactPaths);
