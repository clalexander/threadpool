import { InkSoft } from 'types';
import { ListOptions, OrderingOptions } from './request';

export type OrderSummariesOrderByProperties =
  | 'ID'
  | 'Name'
  | 'FirstName'
  | 'LastName'
  | 'CompanyName'
  | 'ShippingMethod'
  | 'EstimatedShipDate'
  | 'ConfirmedShipDate'
  | 'StoreName'
  | 'DateCreated'
  | 'DateShipped'
  | 'TotalAmount'
  | 'StatusDesription'
  | 'PaymentStatus'
  | 'Organization'
  | 'ProductionStatus'
  | 'Email';

export type DeliveryMethods = 'Pickup' | 'Shipping' | 'None';

export interface OrderSummariesListOptions extends ListOptions,
  OrderingOptions<OrderSummariesOrderByProperties> {
  AssigneeIds?: string[];
  ConfirmedShipDateRange?: InkSoft.DateTimeRange;
  DateCreated?: InkSoft.DateTimeRange;
  DateModifiedRange?: InkSoft.DateTimeRange;
  DeliveryMethods?: DeliveryMethods[];
  DueDateRange?: InkSoft.DateTimeRange;
  EstimatedShipDateRange?: InkSoft.DateTimeRange;
  IncludeProductionCards?: boolean;
  OrderTypes?: InkSoft.Order.Type[];
  Organizations?: string[];
  PaymentSatuses?: InkSoft.OrderPaymentStatus[];
  ProductionStatuses?: InkSoft.Order.ProductionStatus[];
  SearchText?: string;
  ShippingMethodIds?: number[];
  ShippingVendorNames?: string[];
  Status?: InkSoft.Order.Status;
  StoreIds?: number[];
}

export interface GetOrderOptions {
  OrderId: number;
  OrderEmail: string;
  IncludeProductionCards?: boolean;
}
