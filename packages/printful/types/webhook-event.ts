import { ShipmentInfo } from './shipment-info';

export interface WebhookEvent<T = any> {
  type: WebhookEvent.Type;
  created: number;
  retries: number;
  store: number;
  data: T;
}

export namespace WebhookEvent {
  export type Type =
    | 'package_shipped';

  export type DataTypeMap<T extends Type> = {
    ['package_shipped']: ShipmentInfo,
  }[T];
}
