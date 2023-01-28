import { SecretsManagerProvider, SSMParametersProvider } from 'aws-utils';
import { Secret } from 'types';
import { parseEnvInt } from 'utils';
import { InkSoft } from './client';

const CACHE_MAX = parseEnvInt('CACHE_MAX') || 100;
const CACHE_TTL = parseEnvInt('CACHE_TTL') || 300;
const INKSOFT_API_KEY_SECRET_ID = process.env.INKSOFT_API_KEY_SECRET_ID || '';
const INKSOFT_API_BASE_URL_PARAM_ID = process.env.INKSOFT_API_BASE_URL_PARAM_ID || '';

const secretsManager = new SecretsManagerProvider({
  max: CACHE_MAX,
  ttl: CACHE_TTL,
});

const parametersProvicder = new SSMParametersProvider({
  max: CACHE_MAX,
  ttl: CACHE_TTL,
});

async function getInkSoftApiBaseURL(): Promise<string> {
  try {
    return await parametersProvicder.getParameter(INKSOFT_API_BASE_URL_PARAM_ID);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('ERROR: fetching InkSoft baseURL param:', INKSOFT_API_BASE_URL_PARAM_ID);
    throw error;
  }
}

async function getInkSoftApiKey(): Promise<string> {
  try {
    const { secret } = await secretsManager.getSecret<Secret>(INKSOFT_API_KEY_SECRET_ID);
    return secret;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('ERROR: fetching InkSoft api key secret:', INKSOFT_API_KEY_SECRET_ID);
    throw error;
  }
}

let client: InkSoft;

export const inksoft = async (): Promise<InkSoft> => {
  if (!client) {
    const baseURL = await getInkSoftApiBaseURL();
    const apiKey = await getInkSoftApiKey();
    client = new InkSoft({ baseURL, APIKey: apiKey });
  }
  return client;
};
