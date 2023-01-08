import { InkSoftApiModule, Response } from 'inksoft-api-client/types';
import { GetOrderOptions, OrderSummariesListOptions } from 'inksoft-api-client/types/order';
import { InkSoft } from 'types';

export interface Orders {
  listSummaries(options?: OrderSummariesListOptions): Promise<Response<InkSoft.OrderSummary[]>>;
  get(options: GetOrderOptions): Promise<Response<InkSoft.Order>>;
}

const ordersModule: InkSoftApiModule<Orders> = {
  methods: ({ makeRequest }) => ({
    listSummaries: (options?: OrderSummariesListOptions) => makeRequest({
      method: 'GET',
      params: options,
    }),
    get: (options: GetOrderOptions) => makeRequest({
      method: 'GET',
      params: options,
      omitApiKey: true,
    }),
  }),
};

export default ordersModule;
