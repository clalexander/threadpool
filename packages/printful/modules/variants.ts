import {
  PrintfulApiModule,
  Response,
  SyncVariantInfo,
} from 'printful/types';
import { maybeIdAsExternal } from './external-id';

export interface Variants {
  get(
    id: number | string,
    storeId: number,
    isIdExternal: boolean,
  ): Promise<Response<SyncVariantInfo>>;
}

const variantsModule: PrintfulApiModule<Variants> = {
  path: 'store/variants',
  methods: ({ makeRequest }) => ({
    get: (id: number | string, storeId: number, isIdExternal = false) => makeRequest({
      method: 'GET',
      path: maybeIdAsExternal(id, isIdExternal),
      storeId,
    }),
  }),
};

export default variantsModule;
