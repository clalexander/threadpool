import { Address } from './address';
import { File } from './file';
import { ListOptions } from './request';

export interface Order {
  id: number;
  external_id: string;
  store: number;
  status: Order.Status;
  shipping: string;
  shipping_service_name: string;
  created: number;
  updated: number;
  recipient: Address;
  items: Order.Item[];
  branding_items: Order.Item[];
  incomplete_items: Order.IncompleteItem[];
  costs: Order.Costs;
  retail_costs: Order.RetailCosts;
  pricing_breakdown: Order.PricingBreakdown;
  gift: Order.Gift;
  packing_slip: Order.PackingSlip;
}

export namespace Order {
  export type Status = 'draft' | 'failed' | 'pending' | 'canceled' | 'onhold' | 'inprocess' | 'partial' | 'fulfilled' | 'archived';

  export interface Item {
    id: number;
    external_id: string;
    variant_id: number;
    sync_variant_id: number;
    external_variant_id: string;
    warehouse_product_variant_id: number;
    product_tempate_id: number;
    quantity: number;
    price: string;
    retail_price: string;
    name: string;
    product: Item.ProductVariant;
    files: File[];
    options: Item.Option[];
    sku: string;
    discontinued: boolean;
    out_of_stock: boolean;
  }

  export namespace Item {
    export interface ProductVariant {
      variant_id: number;
      product_id: number;
      image: string;
      name: string;
    }

    export interface Option {
      id: string;
      value: string;
    }
  }

  export interface IncompleteItem {
    name: string;
    quantity: number;
    sync_variant_id: number;
    external_variant_id: string;
    external_line_item_id: string;
  }

  export interface Costs {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    digitization: string;
    additional_fee: string;
    fulfillment_fee: string;
    tax: string;
    vat: string;
    total: string;
  }

  export interface RetailCosts {
    currency: string;
    subtotal: string | null;
    discount: string | null;
    shipping: string | null;
    tax: string | null;
    vat: string | null;
    total: string | null;
  }

  export interface PricingBreakdown {
    customer_pays: string;
    printful_price: string;
    profit: string;
    currency_symbol: string;
  }

  export interface Shipment {
    id: number;
    carrier: string;
    service: string;
    tracking_number: string;
    tracking_url: string;
    created: number;
    ship_date: string;
    shipped_at: string;
    reshipment: boolean;
    items: Shipment.Item[];
  }

  export namespace Shipment {
    export interface Item {
      item_id: number;
      quantity: number;
    }
  }

  export interface Gift {
    subject: string;
    message: string;
  }

  export type PackingSlip = {
    email: string;
    phone?: string;
    message?: string;
    logo_url?: string;
    store_name?: string;
    custom_order_id?: string;
  } | {
    email?: string;
    phone: string;
    message?: string;
    logo_url?: string;
    store_name?: string;
    custom_order_id?: string;
  } | {
    email?: string;
    phone?: string;
    message: string;
    logo_url?: string;
    store_name?: string;
    custom_order_id?: string;
  } | {
    email?: string;
    phone?: string;
    message?: string;
    logo_url?: string;
    store_name?: string;
    custom_order_id: string;
  };
}

export interface OrderListOptions extends ListOptions {
  status?: Order.Status;
}

export interface CreateOrder {
  external_id?: string;
  shipping?: string;
  recipient: Address;
  items: Order.Item[];
  retail_costs?: Order.RetailCosts;
  gift?: Order.Gift;
  packing_slip?: Order.PackingSlip;
}

export interface CreateOrderOptions {
  confirm?: boolean;
  update_existing?: boolean;
}
