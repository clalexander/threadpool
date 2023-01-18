import { SyncProduct } from './sync-product';
import { SyncVariant } from './sync-variant';

export interface SyncVariantInfo {
  sync_variant: SyncVariant;
  sync_product: SyncProduct;
}
