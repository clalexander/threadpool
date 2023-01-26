import { Address } from '../../inksoft/types/address';
import { PickupType } from './pickup-type';

export interface ShippingMethod {
  ID: number;
  VenforId: number;
  Name: string;
  Description: string;
  VendorName: string;
  Price: number | null;
  AllowBeforeAddressKnown: boolean;
  AllowResidential: boolean;
  AllowPoBox: boolean;
  AllowCommercial: boolean;
  DiscountingEnabled: boolean;
  ProcessDays: number | null;
  PromptForCartShipperAccount: boolean;
  RequireCartShipperAccount: boolean;
  AllowShippingAddress: boolean;
  ProcessMarkup: number | null;
  PickupSetAtStoreId: number | null;
  TransitDays_Min: number | null;
  TransitDays_Max: number | null;
  RtMarkupDollar: number | null;
  RtMarkupPercent: number | null;
  Address: Address;
  PickupNotes: string;
  PickupDateStart: Date | null;
  PickupDateEnd: Date | null;
  OffsetGmt: number | null;
  PickupType: PickupType;
  CalculationType: string;
  SortOrder: number | null;
  ShipToStateIds: number[];
  IsProposalPickup: boolean;
  IsReferredInProposal: boolean;
}
