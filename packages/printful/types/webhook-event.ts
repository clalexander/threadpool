import { ShipmentInfo } from './shipment-info';

export interface WebhookEvent<T extends WebhookEvent.Type = any> {
  type: T;
  created: number;
  retries: number;
  store: number;
  data: WebhookEvent.DataTypeMap<T>;
}

export namespace WebhookEvent {
  export type Type =
    | 'package_shipped';

  export type DataTypeMap<T extends Type> = {
    ['package_shipped']: ShipmentInfo,
  }[T];
}
