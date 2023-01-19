import { Event } from 'event-utils';
import { DynamoDBDataProvider, QuerySpec } from 'aws-utils';

export interface SummaryEvent<T = any> extends Event<T> {
  expires: number;
}

export interface SummaryEventsKeyOptions {
  id: string;
}

export const SummaryEventsQuerySpecs: QuerySpec[] = [];

export class SummaryEventsData extends DynamoDBDataProvider<SummaryEvent, SummaryEventsKeyOptions> {
  constructor(tableName: string) {
    super(tableName, {
      querySpecs: SummaryEventsQuerySpecs,
      convertDateStrings: true,
    });
  }
}
