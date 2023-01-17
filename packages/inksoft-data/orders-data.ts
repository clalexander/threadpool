import { DynamoDBDataProvider, ItemAttribute } from 'aws-utils';
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
];

export class InkSoftOrdersData extends DynamoDBDataProvider<Order, InkSoftOrderKeyOptions> {
  constructor(tableName: string) {
    super(tableName, InkSoftOrderAttributes);
  }

  protected parseObject(data: string) {
    const object = super.parseObject(data);
    return transformResponse(object);
  }
}
