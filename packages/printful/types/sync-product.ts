import { ListOptions } from './request';

export interface SyncProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumnail_url: string;
  is_ignored: boolean;
}

export interface SyncProductListOptions extends ListOptions {
  category_id?: string;
}
