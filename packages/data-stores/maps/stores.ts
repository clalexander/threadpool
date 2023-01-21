import { DynamoDBDataProvider, QuerySpec } from 'aws-utils';

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

export const StoresMapQuerySpecs: QuerySpec[] = [
  {
    index: 'PrintfulStoreId',
    keyConditionExpression: 'printful_store_id = :id',
    expressionAttributeValues: {
      ':id': 'printful_store_id',
    },
  },
];

export class StoresMapData extends DynamoDBDataProvider<
StoresMap,
StoresMapKeyOptions,
StoresMapQueryOptions
> {
  constructor(tableName: string) {
    super(tableName, {
      querySpecs: StoresMapQuerySpecs,
    });
  }
}
