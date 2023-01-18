import { SyncProduct } from './sync-product';
import { SyncVariant } from './sync-variant';

export interface SyncProductInfo {
  sync_product: SyncProduct;
  sync_variants: SyncVariant[];
}
