import { Order } from './order';
import { OrderPaymentStatus } from './order-payment-status';
import { ProductionCard } from './production-card';

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