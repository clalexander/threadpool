import {
  CreateOrder,
  CreateOrderOptions,
  OrderListOptions,
  PagedResponse,
  PrintfulApiModule,
  Response,
} from 'printful-api-client/types';
import { Printful } from 'types';

export interface Orders {
  list(options?: OrderListOptions): Promise<PagedResponse<Printful.Order[]>>;
  get(id: string, storeId: string): Promise<Response<Printful.Order>>;
  create(
    order: CreateOrder,
    storeId: string,
    options?: CreateOrderOptions,
  ): Promise<Response<Printful.Order>>;
}

const ordersModule: PrintfulApiModule<Orders> = {
  path: 'orders',
  methods: ({ makeRequest }) => ({
    list: (options?: OrderListOptions) => makeRequest({
      method: 'GET',
      params: options,
    }),
    get: (id: string, storeId: string) => makeRequest({
      method: 'GET',
      path: id,
      storeId,
    }),
    create: (order: CreateOrder, storeId: string, options?: CreateOrderOptions) => makeRequest({
      method: 'POST',
      params: options,
      storeId,
      data: order,
    }),
  }),
};

export default ordersModule;
