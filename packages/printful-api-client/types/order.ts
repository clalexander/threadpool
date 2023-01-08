import { Printful } from 'types';
import { ListOptions } from './request';

export interface OrderListOptions extends ListOptions {
  status?: Printful.Order.Status;
}

export interface CreateOrder {
  external_id?: string;
  shipping?: string;
  recipient: Printful.Address;
  items: Printful.Order.Item[];
  retail_costs?: Printful.Order.RetailCosts;
  gift?: Printful.Order.Gift;
  packing_slip?: Printful.Order.PackingSlip;
}

export interface CreateOrderOptions {
  confirm?: boolean;
  update_existing?: boolean;
}
