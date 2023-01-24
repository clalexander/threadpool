import { Order } from './order';
import { OrderShipment } from './order-shipment';

export interface ShipmentInfo {
  shipment: OrderShipment;
  order: Order;
}
