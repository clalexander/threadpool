import { DynamoDBDataProvider, QuerySpec } from 'aws-utils';
import { Order } from 'inksoft';

export interface InkSoftOrderKeyOptions {
  ID: number;
  StoreId: number;
}

export const InkSoftOrderQuerySpecs: QuerySpec[] = [
  {
    index: 'UniqueId',
    keyConditionExpression: 'UniqueId = :uid',
    expressionAttributeValues: {
      ':uid': 'UniqueId',
    },
    getItemAfterQuery: true,
  },
];

export class InkSoftOrdersData extends DynamoDBDataProvider<Order, InkSoftOrderKeyOptions> {
  constructor(tableName: string) {
    super(tableName, {
      querySpecs: InkSoftOrderQuerySpecs,
    });
  }
}
