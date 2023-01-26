import { Order } from 'inksoft';

export const isOrderUpdated = (
  newOrder: Order,
  existingOrder: Order,
): boolean => newOrder.Status !== existingOrder.Status
    || newOrder.PaymentStatus !== existingOrder.PaymentStatus
    || newOrder.ProductionStatus !== existingOrder.ProductionStatus
    || newOrder.Authorized !== existingOrder.Authorized
    || newOrder.Paid !== existingOrder.Paid
    || newOrder.Confirmed !== existingOrder.Confirmed
    || newOrder.Ordered !== existingOrder.Ordered
    || newOrder.Received !== existingOrder.Received
    || newOrder.Prepared !== existingOrder.Prepared
    || newOrder.Shipped !== existingOrder.Shipped
    || newOrder.Cancelled !== existingOrder.Cancelled;
