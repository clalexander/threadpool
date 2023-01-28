import {
  PrintfulApiModule,
  Response,
  WebhookInfo,
  WebhookSetup,
} from 'printful/types';

export interface Webhooks {
  get(storeId: number): Promise<Response<WebhookInfo>>;
  setup(storeId: number, webhook: WebhookSetup): Promise<Response<WebhookInfo>>;
  disable(storeId: number): Promise<Response<WebhookInfo>>;
}

const webhooksModule: PrintfulApiModule<Webhooks> = {
  path: 'webhooks',
  methods: ({ makeRequest }) => ({
    get: (storeId: number) => makeRequest({
      method: 'GET',
      storeId,
    }),
    setup: (storeId: number, webhook: WebhookSetup) => makeRequest({
      method: 'POST',
      data: webhook,
      storeId,
    }),
    disable: (storeId: number) => makeRequest({
      method: 'DELETE',
      storeId,
    }),
  }),
};

export default webhooksModule;
