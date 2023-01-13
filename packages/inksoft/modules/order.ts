import {
  GetOrderOptions,
  InkSoftApiModule,
  Order,
  OrderSummariesListOptions,
  OrderSummary,
  Response,
} from 'inksoft/types';

export interface Orders {
  listSummaries(options?: OrderSummariesListOptions): Promise<Response<OrderSummary[]>>;
  get(options: GetOrderOptions): Promise<Response<Order>>;
}

const ordersModule: InkSoftApiModule<Orders> = {
  methods: ({ makeRequest }) => ({
    listSummaries: (options?: OrderSummariesListOptions) => makeRequest({
      method: 'GET',
      path: 'GetOrderSummaries',
      params: options,
    }),
    get: (options: GetOrderOptions) => makeRequest({
      method: 'GET',
      path: 'GetOrder',
      params: options,
      omitApiKey: true,
    }),
  }),
};

export default ordersModule;
