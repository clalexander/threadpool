import { Event } from 'event-utils';
import { DynamoDBDataProvider, QuerySpec } from 'aws-utils';

export interface SummaryEventsKeyOptions {
  id: string;
}

export type SummaryEventsQueryOptions = {
  start: Date;
  end: Date;
  object: string;
};

export const SummaryEventsQuerySpecs: QuerySpec[] = [
  {
    index: 'Created',
    keyConditionExpression: '#obj = :obj AND created BETWEEN :start AND :end',
    expressionAttributeValues: {
      ':start': 'start',
      ':end': 'end',
      ':obj': 'object',
    },
    expressionAttributeNames: {
      '#obj': 'object',
    },
  },
];

const additionalAttributes = (ttl: number) => ({
  expires: (item: Event) => Math.floor(item.created.getTime() / 1000) + ttl,
});

export class SummaryEventsData extends DynamoDBDataProvider<
Event,
SummaryEventsKeyOptions,
SummaryEventsQueryOptions
> {
  constructor(tableName: string, ttl = 0) {
    super(tableName, {
      querySpecs: SummaryEventsQuerySpecs,
      convertDateStrings: true,
      additionalAttributes: additionalAttributes(ttl),
    });
  }
}
