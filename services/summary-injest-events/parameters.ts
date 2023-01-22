import { SSMParametersProvider } from 'aws-utils';
import { parseEnvInt } from 'utils';
import { EVENT_TTL_PARAM_ID } from './constants';

const CACHE_MAX = parseEnvInt('CACHE_MAX') || 100;
const CACHE_TTL = parseEnvInt('CACHE_TTL') || 300;

const parametersProvicder = new SSMParametersProvider({
  max: CACHE_MAX,
  ttl: CACHE_TTL,
});

export async function getEventTTL(): Promise<number> {
  try {
    const eventTTL = await parametersProvicder.getParameter(EVENT_TTL_PARAM_ID);
    return Number.parseInt(eventTTL, 10);
  } catch (error) {
    return 0;
  }
}
