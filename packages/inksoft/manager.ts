import { SecretsManagerProvider } from 'aws-utils';
import { Secret } from 'types';
import { parseEnvInt } from 'utils';
import { InkSoft } from './client';

const CACHE_MAX = parseEnvInt('CACHE_MAX') || 100;
const CACHE_TTL = parseEnvInt('CACHE_TTL') || 300;
const API_KEY_SECRET_ID = process.env.API_KEY_SECRET_ID || '';

const secretsManager = new SecretsManagerProvider({
  max: CACHE_MAX,
  ttl: CACHE_TTL,
});

async function getInkSoftApiKey(): Promise<string> {
  try {
    const { secret } = await secretsManager.getSecret<Secret>(API_KEY_SECRET_ID);
    return secret;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('ERROR: fetching InkSoft api key secret:', API_KEY_SECRET_ID);
    throw error;
  }
}

let client: InkSoft;

export const inksoftClient = async (): Promise<InkSoft> => {
  if (!client) {
    const apiKey = await getInkSoftApiKey();
    client = new InkSoft({ APIKey: apiKey });
  }
  return client;
};
