import { Address } from './address';
import { Contact } from './contact';
import { CustomLineItem } from './custom-line-item';
import { GiftCertificate } from './gift-certificate';
import { LineItemNote } from './line-item-note';
import { NameNumberSettingGroup } from './name-number-setting-group';
import { NameNumberValue } from './name-number-value';
import { OrderPaymentStatus } from './order-payment-status';
import { PersonalizationValue } from './personalization-value';
import { Product } from './product';
import { ProductionCard } from './production-card';
import { SerializableDictionary } from './serializable-dictionary';
import { ShippingMethod } from './shipping-method';
import { ShoppingCart } from './shopping-cart';
import { SideColorway } from './side-colorway';
import { TimelineEntry } from './timeline-entry';

export interface Order {
  ID: number;
  UniqueId: string;
  ProposalId: number | null;
  ProposalNumber: string;
  Status: Order.Status;
  ProductionStatus: Order.ProductionStatus;
  CurrencyCode: string;
  CurrencySymbol: string;
  DiscountId: number | null;
  DiscountCode: string;
  CouponCode: string;
  Email: string;
  User: Contact;
  AssigneeId: number | null;
  GiftMessage: string;
  IpAddress: string;
  PaymentMethod: string;
  PaymentMethodNote: string;
  PaymentStatus: OrderPaymentStatus;
  CardType: string;
  PurchaseOrderAttachmentUrl: string;
  BillingAddress: Address;
  ShippingAddress: Address;
  ShippingMethod: ShippingMethod;
  RetailAmount: number;
  ShippingAmount: number;
  ShippingTax: number;
  DiscountTax: number;
  DiscountShipping: number;
  TaxRate: number;
  TaxAmount: number;
  TaxName: string;
  TaxAreaId: number | null;
  TotalAmount: number;
  GiftCertificateAmount: number;
  AmountDue: number;
  RetailDiscount: number;
  TotalDiscount: number;
  QuantityDiscountAmount: number;
  QuantityDiscountPercent: number;
  ProcessAmount: number;
  DateCreated: Date | null;
  DueDate: Date | null;
  EstimatedShipDate: Date | null;
  ConfirmedShipDate: Date | null;
  EstimatedDeliveryDate_Min: Date | null;
  EstimatedDeliveryDate_Max: Date | null;
  PaymentRequestSentDate: Date | null;
  DisplayPricing: boolean;
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
  Notes: string;
  Payments: Order.Payment[];
  ProductStyleSizePrices: Product.Style.Size.Price[];
  Items: Order.Item[];
  Shipments: Order.Shipment[];
  GiftCertficates: GiftCertificate[];
  PurchasedGiftCertificates: GiftCertificate[];
  NameNumberSettings: NameNumberSettingGroup[];
  CheckoutFieldValues: SerializableDictionary;
  ProductStyleSizeInventoryStat: SerializableDictionary;
  ShortCodes: SerializableDictionary;
  Timeline: TimelineEntry;
  ExportedToQuickbooks: boolean;
  DateExportedToQuickbooks: Date | null;
  ContactEmailAddresses: string[];
  TotalAdjustments: Order.TotalAdjustment[];
  ProductionCards: ProductionCard[];
  CustomLineItems: CustomLineItem[];
  ReadyForPickupNotificationSentDate: Date | null;
  ApprovalRequired: boolean;
  ApprovalDate: Date | null;
  LineItemNotes: LineItemNote[];
}

export namespace Order {
  export type Status = 'Canceled' | 'Processing' | 'Fulfilled' | 'Shipped';

  export type Type = 'WebOrder' | 'Invoice' | 'Proposals';

  export type ProductionStatus = 'Open' | 'Scheduled' | 'In Production' | 'Ready to Ship' | 'Ready for Pickup' | 'Complete';

  export interface TotalAdjustment {
    ID: number;
    Type: TotalAdjustment.Type;
    Description: string;
    Percentage: number | null;
    Amount: number;
    CreatedByName: string;
    Created: Date;
    ModifiedByName: string;
    LastModified: Date;
  }

  export namespace TotalAdjustment {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    export type Type = 'Discount' | 'Fee' | 'Refund';
  }

  export interface Payment {
    ID: number;
    OrderId: number | null;
    ProposalId: number | null;
    EventType: string;
    CardLast4: string;
    CardType: string;
    ResponseCode: string;
    TransactionId: string;
    OriginalTransactionId: string;
    ApprovalCode: string;
    AvsCode: string;
    DateCreated: Date;
    DateVoided: Date | null;
    TestMode: boolean;
    GatewayAccount: string;
    GiftCertificateId: number | null;
    Amount: number | null;
    ProcessingFee: number | null;
    InkSoftFee: number | null;
    GatewayName: string;
    AttachmentFileName: string;
    Notes: string;
    BillingAddress: Address;
  }

  export interface Item {
    OrderRetailItemId: number;
    OrderRetailItemSizeId: number;
    InProduction: boolean;
    OriginalOrderRetailItemId: number | null;
    KeepExistingPrintMethod: boolean;
    RetailItemId: number;
    RetailItemSizeId: number;
    ProductId: number;
    ProductStyleId: number;
    ProductStyleSizeId: number;
    Quasntity: number;
    ArtId: number | null;
    DesignId: number | null;
    SideColorways: SideColorway[];
    UnitPrice: number;
    ItemTotal: number;
    TaxRate: number | null;
    TaxRateOverride: number | null;
    FullName: string;
    PrintCost: number | null;
    PrintSetupCharge: number | null;
    QuantityDiscountAmount: number | null;
    QuantityDiscountPercent: number | null;
    ProudctPriceEachOverride: number | null;
    ProductPriceEach: number | null;
    PrintSetupPriceFront: number | null;
    PrintSetupPriceBack: number | null;
    PrintSetupPriceSleeveLeft: number | null;
    PrintSetupPrcieSleeveRight: number | null;
    PrintSetupOverridePriceFront: number | null;
    PrintSetupOverridePriceBack: number | null;
    PrintSetupOverridePriceSleeveLeft: number | null;
    PrintSetupOverridePriceSleeveRight: number | null;
    PrintCostOverride: number | null;
    PrintPriceFront: number | null;
    PrintPriceBack: number | null;
    PrintPriceSleeveLeft: number | null;
    PrintPriceSleeveRight: number | null;
    PrintOverridePriceFront: number | null;
    PrintOverridePriceBack: number | null;
    PrintOverridePriceSleeveLeft: number | null;
    PrintOverridePriceSleeveright: number | null;
    EstimatedProductionDays: number | null;
    PersonalizationValues: PersonalizationValue[];
    NameNumberValues: NameNumberValue[];
    AddOns: ShoppingCart.Item.AddOn[];
    SidePreviews: ShoppingCart.Item.Preview[];
    Notes: string;
  }

  export interface Shipment {
    ID: number;
    OrderId: number;
    PackageCount: number;
    DateCreated: Date;
    LastModified: Date;
    Notes: string;
    PickedUpBy: string;
    Pickup: boolean;
    ToAddress: Address;
    FromAddress: Address;
    Packages: Shipment.Package[];
  }

  export namespace Shipment {
    export interface Package {
      ID: number;
      ShippedDate: Date | null;
      TrackingNumber: string;
      TrackingUrl: string;
      ShippingServiceType: string;
      Status: string;
      CarrierName: string;
      ShippingLabelFileName: string;
      LabelCost: number | null;
      Items: Package.Item[];
    }

    export namespace Package {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      export interface Item {
        ID: number;
        OrderRetailItemSizeId: number;
        Quantity: number;
      }
    }
  }
}
