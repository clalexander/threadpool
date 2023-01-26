export interface CustomLineItem {
  ID: number;
  ParentId: number | null;
  UniqueId: string | null;
  Name: string;
  Description: string;
  ImageUrl: string;
  Taxable: boolean;
  TaxRate: number | null;
  TaxRateOverride: number | null;
  UnitCost: number | null;
  UnitPrice: number;
  UnitWeight: number | null;
  Quantity: number | null;
  UnitType: CustomLineItem.UnitType;
  Active: boolean;
  Size: string;
  Style: string;
  CustomLineItemImages: CustomLineItem.Image[];
}

export namespace CustomLineItem {
  export type UnitType = 'PerHour' | 'PerItem';

  export interface Image {
    ID: number;
    UniqueId: string | null;
    ImageUrl: string;
    Deleted: boolean;
  }
}
