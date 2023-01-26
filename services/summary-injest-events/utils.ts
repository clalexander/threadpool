import { SummaryEventsData } from 'data-stores';
import { SUMMARY_EVENTS_TABLE_NAME } from './constants';

let summaryEventsData: SummaryEventsData;

export const getSummaryEventsData = (eventTTL: number) => {
  if (summaryEventsData === undefined) {
    summaryEventsData = new SummaryEventsData(SUMMARY_EVENTS_TABLE_NAME, eventTTL);
  }
  return summaryEventsData;
};
