import {
  CreateOrder,
  CreateOrderOptions,
  Order,
  OrderListOptions,
  PagedResponse,
  PrintfulApiModule,
  Response,
} from 'printful/types';

export interface Orders {
  list(options?: OrderListOptions): Promise<PagedResponse<Order[]>>;
  get(id: string, storeId: string): Promise<Response<Order>>;
  create(
    order: CreateOrder,
    storeId: string,
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
