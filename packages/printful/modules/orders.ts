import {
  CreateOrder,
  CreateOrderOptions,
  Order,
  OrderListOptions,
  PagedResponse,
  PrintfulApiModule,
  Response,
} from 'printful/types';
import { maybeIdAsExternal } from './external-id';

export interface Orders {
  list(options?: OrderListOptions): Promise<PagedResponse<Order[]>>;
  get(id: number | string, storeId: number, isIdExternal: boolean): Promise<Response<Order>>;
  create(
    order: CreateOrder,
    storeId: number,
    options?: CreateOrderOptions,
  ): Promise<Response<Order>>;
}

const ordersModule: PrintfulApiModule<Orders> = {
  path: 'orders',
  methods: ({ makeRequest }) => ({
    list: (options?: OrderListOptions) => makeRequest({
      method: 'GET',
      params: options,
    }),
    get: (id: number | string, storeId: number, isIdExternal = false) => makeRequest({
      method: 'GET',
      path: maybeIdAsExternal(id, isIdExternal),
      storeId,
    }),
    create: (order: CreateOrder, storeId: number, options?: CreateOrderOptions) => makeRequest({
      method: 'POST',
      params: options,
      storeId,
      data: order,
    }),
  }),
};

export default ordersModule;
