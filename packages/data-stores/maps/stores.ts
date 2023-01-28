import { DynamoDBDataProvider, QuerySpec } from 'aws-utils';
import { StoresMap } from 'types';

export interface StoresMapKeyOptions {
  inksoft_store_id: number;
}

export type StoresMapQueryOptions = {
  printful_store_id: number;
};

export const StoresMapQuerySpecs: QuerySpec[] = [
  {
    index: 'PrintfulStoreId',
    conditionExpression: 'printful_store_id = :id',
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
