import { eventbridgeEventBodyParser, SQSHandler } from 'aws-utils';
import { Event, publishEvent } from 'event-utils';
import { inksoft, OrderSummary } from 'inksoft';
import { InkSoftOrdersData } from 'data-stores';
import { TABLE_NAME, TARGET_EVENTBRIDGE_ARN } from './constants';
import { OrderEventType, ServiceEventType } from './events';
import { isOrderUpdated } from './utils';

const ordersData = new InkSoftOrdersData(TABLE_NAME);

const eventHandler = async (event: Event<OrderSummary>) => {
  const orderSummary = event.data;
  const { ID, StoreId, Email } = orderSummary;
  let orderUpdated = false;
  const existingOrder = await ordersData.getItem({ ID, StoreId });
  const client = await inksoft();
  const response = await client.orders.get({
    OrderId: ID,
    OrderEmail: Email,
  });
  const order = response.Data;
  if (order === false) {
    // should not get here because not found api error should already have been thrown
    throw new Error('Missing order data!');
  }
  if (existingOrder === null) {
    await publishEvent({
      bus: TARGET_EVENTBRIDGE_ARN,
      type: OrderEventType.Received,
      data: order,
    });
    orderUpdated = true;
  } else if (isOrderUpdated(order, existingOrder)) {
    await publishEvent({
      bus: TARGET_EVENTBRIDGE_ARN,
      type: OrderEventType.Updated,
      data: order,
    });
    orderUpdated = true;
  }
  // nothing more to do if order hasn't been updated
  if (orderUpdated) {
    await ordersData.putItem(order);
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
