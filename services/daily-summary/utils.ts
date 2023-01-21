import { OUTPUT_TIMEZONE } from './constants';

export const dateToStr = (date: Date): string => date.toLocaleString(undefined, {
  timeZone: OUTPUT_TIMEZONE,
  dateStyle: 'short',
  timeStyle: 'short',
});
