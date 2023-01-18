import { DynamoDBDataProvider, ItemAttribute, QuerySpec } from 'aws-utils';
import { Order } from 'printful';

export interface PrintfulOrderKeyOptions {
  id: number;
  store: number;
}

export type PrintfulOrderQueryOptions = {
  external_id: string;
};

export const PrintfulOrderAttributes: ItemAttribute[] = [
  {
    name: 'id',
    type: 'N',
  },
  {
    name: 'store',
    type: 'N',
  },
  {
    name: 'external_id',
    type: 'S',
  },
];

export const PrintfulOrderQuerySpecs: QuerySpec[] = [
  {
    index: 'ExternalId',
    keyConditionExpression: 'external_id = :eid',
    expressionAttributeValues: {
      external_id: ':eid',
    },
  },
];

export class PrintfulOrdersData extends DynamoDBDataProvider<
Order,
PrintfulOrderKeyOptions,
PrintfulOrderQueryOptions
> {
  constructor(tableName: string) {
    super(tableName, PrintfulOrderAttributes, PrintfulOrderQuerySpecs, true);
  }
}
