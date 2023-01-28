import { PrintfulWebhookConfig, StoresMap } from 'types';

export const makePrinfulWebhookConfig = (storesMap: StoresMap): PrintfulWebhookConfig => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { printful_store_id } = storesMap;
  return { store_id: printful_store_id };
};
