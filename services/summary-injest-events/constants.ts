import { parseEnvInt } from 'utils';

export const SUMMARY_EVENTS_TABLE_NAME = process.env.SUMMARY_EVENTS_TABLE_NAME || '';
export const EVENT_TTL = parseEnvInt('EVENT_TTL') || 0;
