import { SecretsManagerProvider } from 'aws-utils';
import { Secret } from 'types';
import { parseEnvInt } from 'utils';
import { Printful } from './client';

const CACHE_MAX = parseEnvInt('CACHE_MAX') || 100;
const CACHE_TTL = parseEnvInt('CACHE_TTL') || 300;
const API_TOKEN_SECRET_ID = process.env.API_TOKEN_SECRET_ID || '';

const secretsManager = new SecretsManagerProvider({
  max: CACHE_MAX,
  ttl: CACHE_TTL,
});

async function getPrintfulApiToken(): Promise<string> {
  try {
    const { secret } = await secretsManager.getSecret<Secret>(API_TOKEN_SECRET_ID);
    return secret;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('ERROR: fetching Printful api key secret:', API_TOKEN_SECRET_ID);
    throw error;
  }
}

let client: Printful;

export const printful = async (): Promise<Printful> => {
  if (!client) {
    const token = await getPrintfulApiToken();
    client = new Printful({ token });
  }
  return client;
};
