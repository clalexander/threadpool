import { File } from './file';

export interface SyncVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  retail_price: string;
  currency: string;
  is_ignored: boolean;
  sku: string;
  product: SyncVariant.Product;
  files: File[];
  options: SyncVariant.Option[];
  main_category_id: number;
  warehouse_product_variant_id: number | null;
}

export namespace SyncVariant {
  export interface Product {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  }

  export interface Option {
    id: string;
    value: string;
  }
}
