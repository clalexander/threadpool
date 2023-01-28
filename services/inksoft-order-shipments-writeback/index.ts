import { eventbridgeEventBodyParser, SQSHandler } from 'aws-utils';
import { InkSoftOrdersData } from 'data-stores';
import { Event, publishEvent } from 'event-utils';
import { inksoft } from 'inksoft';
import { WebhookEvent } from 'printful';
import {
  INKSOFT_ORDERS_TABLE_NAME,
  TARGET_EVENTBRIDGE_ARN,
} from './constants';

const ordersData = new InkSoftOrdersData(INKSOFT_ORDERS_TABLE_NAME);

const eventHandler = async (event: Event<WebhookEvent<'package_shipped'>>) => {
  const { shipment, order } = event.data.data;
  const { status, external_id: externalId } = order;
  const { tracking_number: trackingNumber } = shipment;
  const isCompleted = status === 'fulfilled';
  const inksoftOrder = await ordersData.queryItem({
    UniqueId: externalId,
  });
  if (inksoftOrder === null) {
    throw new Error(`Unable to find InkSoft order for external id: ${externalId}`);
  }
  const client = await inksoft();
  const response = await client.orders.createShipments({
    // HERE does the UniqueId (external_id) work?  if not are order ids unique across stores?
    OrderIds: [externalId],
    TrackingNumber: trackingNumber,
    MarkOrderAsCompleted: isCompleted,
    NotifyCustomer: true,
  });
  if (!response.Data) {
    throw new Error('Failed to create shipment for order.');
  }
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: 'inksoft.order.shipment_created',
    data: inksoftOrder,
  });
};

const errorHandler = async (error: any) => {
  // lifecycle: service failed
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: 'service.inksoft_order_shipments_writeback.failed',
    data: error,
  });
  return false;
};

export const handler = SQSHandler(eventHandler, {
  bodyParser: eventbridgeEventBodyParser,
  errorHandler,
});
