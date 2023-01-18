import {
  PagedResponse,
  PrintfulApiModule,
  Response,
  SyncProduct,
  SyncProductInfo,
  SyncProductListOptions,
} from 'printful/types';
import { maybeIdAsExternal } from './external-id';

export interface Products {
  list(storeId: number, options?: SyncProductListOptions): Promise<PagedResponse<SyncProduct[]>>;
  get(
    id: number | string,
    storeId: number,
    isIdExternal: boolean,
  ): Promise<Response<SyncProductInfo>>;
}

const productsModule: PrintfulApiModule<Products> = {
  path: 'store/products',
  methods: ({ makeRequest }) => ({
    list: (storeId: number, options?: SyncProductListOptions) => makeRequest({
      method: 'GET',
      params: options,
      storeId,
    }),
    get: (id: number | string, storeId: number, isIdExternal = false) => makeRequest({
      method: 'GET',
      path: maybeIdAsExternal(id, isIdExternal),
      storeId,
    }),
  }),
};

export default productsModule;
