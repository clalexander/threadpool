export interface OrderShipment {
  id: number;
  carrier: string;
  service: string; // delivery service name
  tracking_number: string;
  tracking_url: string;
  create: number;
  ship_date: string;
  shipped_at: string; // ship time in unix timestamp
  reshipment: boolean;
  items: OrderShipment.Item[];
}

export namespace OrderShipment {
  export interface Item {
    item_id: number; // line item id
    quantity: number;
  }
}
