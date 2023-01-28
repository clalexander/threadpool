import { PRINTFUL_WEBHOOK_URL, WEBHOOK_TOKEN_QUERY_PARAM } from './constants';
import { getWebhookToken } from './token';

export const getWebhookURL = async () => {
  const token = await getWebhookToken();
  return `${PRINTFUL_WEBHOOK_URL}/webhook?${WEBHOOK_TOKEN_QUERY_PARAM}=${token}`;
};
