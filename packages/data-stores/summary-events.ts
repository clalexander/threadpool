import { Event } from 'event-utils';
import { DynamoDBDataProvider, ScanSpec } from 'aws-utils';

export interface SummaryEventsKeyOptions {
  id: string;
}

export type SummaryEventsQueryOptions = Record<string, any>;

export type SummaryEventsScanOptions = {
  start: Date;
  end: Date;
};

export const SummaryEventsScanSpecs: ScanSpec[] = [
  {
    conditionExpression: 'created BETWEEN :start AND :end',
    expressionAttributeValues: {
      ':start': 'start',
      ':end': 'end',
    },
  },
];

const additionalAttributes = (ttl: number) => ({
  expires: (item: Event) => Math.floor(item.created.getTime() / 1000) + ttl,
});

export class SummaryEventsData extends DynamoDBDataProvider<
Event,
SummaryEventsKeyOptions,
SummaryEventsQueryOptions,
SummaryEventsScanOptions
> {
  constructor(tableName: string, ttl = 0) {
    super(tableName, {
      scanSpecs: SummaryEventsScanSpecs,
      convertDateStrings: true,
      additionalAttributes: additionalAttributes(ttl),
    });
  }
}
