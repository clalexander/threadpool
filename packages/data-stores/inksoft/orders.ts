import { DynamoDBDataProvider, ItemAttribute, QuerySpec } from 'aws-utils';
import { Order } from 'inksoft';
import { transformResponse } from 'inksoft/utils';

export interface InkSoftOrderKeyOptions {
  ID: number;
  StoreId: number;
}

export const InkSoftOrderAttributes: ItemAttribute[] = [
  {
    name: 'ID',
    type: 'N',
  },
  {
    name: 'StoreId',
    type: 'N',
  },
  {
    name: 'UniqueId',
    type: 'S',
  },
];

export const InkSoftOrderQuerySpecs: QuerySpec[] = [
  {
    index: 'UniqueId',
    keyConditionExpression: 'UniqueId = :uid',
    expressionAttributeValues: {
      UniqueId: ':uid',
    },
  },
];

export class InkSoftOrdersData extends DynamoDBDataProvider<Order, InkSoftOrderKeyOptions> {
  constructor(tableName: string) {
    super(tableName, InkSoftOrderAttributes, InkSoftOrderQuerySpecs, true);
  }

  protected parseObject(data: string) {
    const object = super.parseObject(data);
    return transformResponse(object);
  }
}
