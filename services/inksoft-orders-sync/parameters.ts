import { SSMParametersProvider } from 'aws-utils';
import { parseEnvInt } from 'utils';
import { MIN_START_TIME_PARAM_ID, START_OFFSET_PARAM_ID } from './constants';

const CACHE_MAX = parseEnvInt('CACHE_MAX') || 100;
const CACHE_TTL = parseEnvInt('CACHE_TTL') || 300;

const parametersProvicder = new SSMParametersProvider({
  max: CACHE_MAX,
  ttl: CACHE_TTL,
});

export async function getMinStartTime(): Promise<number | null> {
  try {
    const minStartTimeParam = await parametersProvicder.getParameter(MIN_START_TIME_PARAM_ID);
    return Number.parseInt(minStartTimeParam, 10);
  } catch (error) {
    return null;
  }
}

export async function getStartOffset(): Promise<number> {
  try {
    const startOffsetParam = await parametersProvicder.getParameter(START_OFFSET_PARAM_ID);
    return Number.parseInt(startOffsetParam, 10);
  } catch (error) {
    return 0;
  }
}
