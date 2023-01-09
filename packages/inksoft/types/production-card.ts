import { Art } from './art';
import { NameNumberValue } from './name-number-value';
import { OrderPaymentStatus } from './order-payment-status';
import { PersonalizationValue } from './personalization-value';
import { Product } from './product';
import { TimelineEntry } from './timeline-entry';

export interface ProductionCard {
  ID: number;
  JobId: number | null;
  JobName: string;
  JobStatusName: string;
  JobStatusId: number | null;
  JobNumber: string;
  OrderId: number;
  OrderFirstName: string;
  OrderLastName: string;
  OrderEmail: string;
  OrderStoreName: string;
  OrderDate: Date;
  OrderRetailItemId: number;
  OrderPaymentStatus: OrderPaymentStatus;
  Number: string;
  DesignGroupKey: string;
  ShipDate: Date | null;
  ProductId: number | null;
  ProductName: string;
  ProductSku: string;
  ProductManufacturer: string;
  ProductSupplier: string;
  ProductStyleName: string;
  ProductStyleId: number;
  /**
   * NOTE: does not match docs, not being returned in request
   */
  DesignName?: string;
  /**
   * NOTE: does not match docs, not being returned in request
   */
  DesignType?: ProductionCard.DesignType | null;
  Art: Art;
  ArtId: number | null;
  /**
   * NOTE: does not match docs, not being returned in request
   */
  DesignId?: number | null;
  ColorwayId: number | null;
  CanvasId: number | null;
  Side: string;
  SideInternalName: string;
  RegionName: string;
  Region: Product.Region;
  ProductType: Product.Type;
  SizeUnit: string;
  ProductUrl: string;
  PreviewUrl: string;
  /**
   * NOTE: does not match docs, not being returned in request
   */
  DesignUrl?: string;
  ArtUrl: string;
  PrintMethod: string;
  Quantity: number;
  ColorCount: number | null;
  ProductionNotes: string;
  OrderNotes: string;
  OrderItemNotes: string;
  DateCompleted: Date | null;
  Timeline: TimelineEntry[];
  Attachments: ProductionCard.Attachment[];
  Colors: ProductionCard.Color[];
  Items: ProductionCard.Item[];
  ColorwayName: string;
  ProductHtmlColor: string;
  ProductShape: string;
  EstimatedProductionDays: number | null;
}

export namespace ProductionCard {
  /**
   * NOTE: DesignType is not documented
   */
  export type DesignType = 'Unknown';

  export interface Attachment {
    ID: number;
    Type: Attachment.Type;
    ProductionCardId: number;
    OriginalName: string;
    Name: string;
    Description: string;
    MimeType: string;
    Url: string;
    UrlThumbnail: string;
    UrlPreivew: string;
  }

  export namespace Attachment {
  /**
   * NOTE: Attachment.Type is not documented
   */
    export type Type = 'Unknown';
  }

  export interface Color {
    ID: number;
    ProductionCardId: number;
    Index: number;
    Name: string;
    PMS: string;
    HtmlColor: string;
    ThreadLibraryNae: string;
    ThreadChartName: string;
    ThreadColorName: string;
    ThreadColorCode: string;
  }

  export interface Item {
    ID: number;
    ProductionCardId: number;
    OrderRetailItemSizeId: number;
    Size: string;
    Quantity: number;
    Status: string;
    PurchasingStatus: string;
    IsChecked: boolean;
    PersonalizationValues: PersonalizationValue[];
    NameNumberValue: NameNumberValue;
    SortOrder: number;
  }
}
