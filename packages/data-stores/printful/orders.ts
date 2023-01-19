import { DynamoDBDataProvider, QuerySpec } from 'aws-utils';
import { Order } from 'printful';

export interface PrintfulOrderKeyOptions {
  id: number;
  store: number;
}

export type PrintfulOrderQueryOptions = {
  external_id: string;
};

export const PrintfulOrderQuerySpecs: QuerySpec[] = [
  {
    index: 'ExternalId',
    keyConditionExpression: 'external_id = :eid',
    expressionAttributeValues: {
      external_id: ':eid',
    },
    getItemAfterQuery: true,
  },
];

export class PrintfulOrdersData extends DynamoDBDataProvider<
Order,
PrintfulOrderKeyOptions,
PrintfulOrderQueryOptions
> {
  constructor(tableName: string) {
    super(tableName, {
      querySpecs: PrintfulOrderQuerySpecs,
    });
  }
}
