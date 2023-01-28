import { SecretsManagerProvider } from 'aws-utils';
import { Secret } from 'types';
import { parseEnvInt } from 'utils';
import { PRINTFUL_WEBHOOK_TOKEN_SECRET_ID } from './constants';

const CACHE_MAX = parseEnvInt('CACHE_MAX') || 100;
const CACHE_TTL = parseEnvInt('CACHE_TTL') || 300;

const secretsManager = new SecretsManagerProvider({
  max: CACHE_MAX,
  ttl: CACHE_TTL,
});

export async function getWebhookToken(): Promise<string> {
  try {
    const { secret } = await secretsManager.getSecret<Secret>(PRINTFUL_WEBHOOK_TOKEN_SECRET_ID);
    return secret;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('ERROR: fetching webhook token secret:', PRINTFUL_WEBHOOK_TOKEN_SECRET_ID);
    throw error;
  }
}
