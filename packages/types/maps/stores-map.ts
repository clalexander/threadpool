import { RecordMutation } from 'types/utils';

export interface StoresMap {
  inksoft_store_id: number;
  printful_store_id: number;
  name?: string;
}

export interface StoresMapRecordMutation extends RecordMutation<StoresMap> {}
