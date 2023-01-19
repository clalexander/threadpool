import { eventbridgeEventBodyParser, SQSHandler } from 'aws-utils';
import { PrintfulOrdersData, StoresMapData } from 'data-stores';
import { Event, publishEvent } from 'event-utils';
import { Order as InkSoftOrder } from 'inksoft';
import { printful } from 'printful';
import {
  ALLOW_CREATE,
  ORDERS_TABLE_NAME,
  STORES_MAP_TABLE_NAME,
  TARGET_EVENTBRIDGE_ARN,
} from './constants';
import {
  InkSoftOrderEventType,
  PrintfulOrderEventType,
  ServiceEventType,
} from './events';
import {
  getPrintfulVariantExternalId,
  makeCreatePrintfulOrder,
  shouldCreateNewPrinfulOrder,
} from './utils';

const storesMapData = new StoresMapData(STORES_MAP_TABLE_NAME);
const ordersData = new PrintfulOrdersData(ORDERS_TABLE_NAME);

// HERE WIP remove console log statements
const eventHandler = async (event: Event<InkSoftOrder>) => {
  const inksoftOrder = event.data;
  console.log('printful order fulfillment', inksoftOrder);
  const { UniqueId } = inksoftOrder;
  const existingOrder = await ordersData.queryItem({ external_id: UniqueId });
  const client = await printful();
  const shouldCreateNewOrder = shouldCreateNewPrinfulOrder(inksoftOrder, existingOrder);
  console.log('should create new order', shouldCreateNewOrder, existingOrder);
  // HERE remove constant expression
  // eslint-disable-next-line no-constant-condition
  if (shouldCreateNewOrder || true) {
    const storeMap = await storesMapData.getItem({
      inksoft_store_id: inksoftOrder.StoreId,
    });
    console.log('store map', storeMap);
    if (!storeMap) {
      throw new Error(`Missing store map for InkSoft store: ${inksoftOrder.StoreId}`);
    }
    const storeId = storeMap.printful_store_id;
    // get all printful variants for items from printful
    // const printfulVariantPromises = inksoftOrder.Items
    //   .map((item) => {
    //     const externalId = getPrintfulVariantExternalId(item);
    //     console.log('externalId', externalId);
    //     return client.variants.get(externalId, storeId, true);
    //   });
    const externalId = getPrintfulVariantExternalId(inksoftOrder.Items[0]);
    console.log('before responses');
    const printfulVariantResponse = await client.variants.get(externalId, storeId, true);
    // const printfulVariantResponses = await Promise.all(printfulVariantPromises);
    console.log('after response', printfulVariantResponse);
    const printfulVariantResponses = [printfulVariantResponse];
    const printfulVariants = printfulVariantResponses
      .map((response) => response.result.sync_variant)
      .reduce((acc, variant) => ({
        ...acc,
        [variant.external_id]: variant,
      }), {});
    console.log('printful variants', printfulVariants);
    const createOrder = makeCreatePrintfulOrder(inksoftOrder, printfulVariants);
    console.log('create order', createOrder);
    // allow create when env ALLOW_CREATE is set
    if (ALLOW_CREATE) {
      console.log('attempting to create Printful order');
      const response = await client.orders.create(createOrder, storeId, { confirm: true });
      await publishEvent({
        bus: TARGET_EVENTBRIDGE_ARN,
        type: InkSoftOrderEventType.Sent,
        data: inksoftOrder,
      });
      const newOrder = response.result;
      console.log('new Printful order:', newOrder);
      await ordersData.putItem(newOrder);
      await publishEvent({
        bus: TARGET_EVENTBRIDGE_ARN,
        type: PrintfulOrderEventType.Created,
        data: newOrder,
      });
    }
  }
};

const errorHandler = async (error: any) => {
  // lifecycle: service failed
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: ServiceEventType.Failed,
    data: error,
  });
  return false;
};

export const handler = SQSHandler(eventHandler, {
  bodyParser: eventbridgeEventBodyParser,
  errorHandler,
});
