import { DynamoDBDataProvider, ItemAttribute, QuerySpec } from 'aws-utils';

export interface StoresMap {
  inksoft_store_id: number;
  printful_store_id: number;
  name?: string;
}

export interface StoresMapKeyOptions {
  inksoft_store_id: number;
}

export type StoresMapQueryOptions = {
  printful_store_id: number;
};

export const StoresMapAttributes: ItemAttribute[] = [
  {
    name: 'inksoft_store_id',
    type: 'N',
  },
  {
    name: 'printful_store_id',
    type: 'N',
  },
  {
    name: 'name',
    type: 'S',
  },
];

export const StoresMapQuerySpecs: QuerySpec[] = [
  {
    index: 'PrintfulStoreId',
    keyConditionExpression: 'printful_store_id = :id',
    expressionAttributeValues: {
      printful_store_id: ':id',
    },
  },
];

export class StoresMapData extends DynamoDBDataProvider<
StoresMap,
StoresMapKeyOptions,
StoresMapQueryOptions
> {
  constructor(tableName: string) {
    super(tableName, StoresMapAttributes, StoresMapQuerySpecs);
  }
}
