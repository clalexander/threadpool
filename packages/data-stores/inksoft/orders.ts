import { DynamoDBDataProvider, QuerySpec } from 'aws-utils';
import { Order } from 'inksoft';

export interface InkSoftOrderKeyOptions {
  ID: number;
  StoreId: number;
}

export type InkSoftOrderQueryOptions = {
  UniqueId: string
};

export const InkSoftOrderQuerySpecs: QuerySpec[] = [
  {
    index: 'UniqueId',
    conditionExpression: 'UniqueId = :uid',
    expressionAttributeValues: {
      ':uid': 'UniqueId',
    },
    getItemsAfterQuery: true,
  },
];

export class InkSoftOrdersData extends DynamoDBDataProvider<
Order,
InkSoftOrderKeyOptions,
InkSoftOrderQueryOptions
> {
  constructor(tableName: string) {
    super(tableName, {
      querySpecs: InkSoftOrderQuerySpecs,
    });
  }
}
