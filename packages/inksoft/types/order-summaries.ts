import { DateTimeRange } from './date-time-range';
import { DeliveryMethods, Order } from './order';
import { OrderPaymentStatus } from './order-payment-status';
import { ProductionCard } from './production-card';
import { ListOptions, OrderingOptions } from './request';

export interface OrderSummary {
  ID: number;
  UserId: number;
  Customer: string;
  FirstName: string;
  LastName: string;
  CompanyName: string;
  DateCreated: Date;
  IpAddress: string;
  PaymentMethod: string;
  PaymentStatus: OrderPaymentStatus;
  TotalDiscount: number;
  TotalAmount: number;
  AmountDue: number;
  ProposalId: number | null;
  OrderType: string;
  ProcessAmount: number;
  PaymentDueDate: Date | null;
  EstimatedShipDate: Date | null;
  ConfirmedShipDate: Date | null;
  EstimatedDeliveryDate_Min: Date | null;
  EstimatedDeliveryDate_Max: Date | null;
  ReadyForPickupNotificationSentDate: Date | null;
  Status: Order.Status;
  Email: string;
  Authorized: boolean;
  Paid: boolean;
  Confirmed: boolean;
  Ordered: boolean;
  Received: boolean;
  Prepared: boolean;
  Shipped: boolean;
  Cancelled: boolean;
  StoreName: string;
  StoreId: number;
  ProductionStatus: Order.ProductionStatus;
  ShippingMethodId: number | null;
  ShippingMethodName: string;
  ShippingVendorId: number | null;
  VendorType: string;
  ExportedToQuickBooks: boolean;
  DateExportedToQuickBooks: Date | null;
  ProductionCardCount: number;
  JobCount: number;
  ProductionCards: ProductionCard[];
}

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

export interface OrderSummariesListOptions extends ListOptions,
  OrderingOptions<OrderSummariesOrderByProperties> {
  AssigneeIds?: string[];
  ConfirmedShipDateRange?: DateTimeRange;
  DateCreatedRange?: DateTimeRange;
  DateModifiedRange?: DateTimeRange;
  DeliveryMethods?: DeliveryMethods[];
  DueDateRange?: DateTimeRange;
  EstimatedShipDateRange?: DateTimeRange;
  IncludeProductionCards?: boolean;
  OrderTypes?: Order.Type[];
  Organizations?: string[];
  PaymentSatuses?: OrderPaymentStatus[];
  ProductionStatuses?: Order.ProductionStatus[];
  SearchText?: string;
  ShippingMethodIds?: number[];
  ShippingVendorNames?: string[];
  Status?: Order.Status;
  StoreIds?: number[];
}
