import { Address } from './address';
import { Origin } from './origin';
import { Phone } from './phone';
import { Tag } from './tag';
import { Tier } from './tier';
import { TimelineEntry } from './timeline-entry';

export interface Contact {
  ID: number;
  Fax: string;
  Note: string;
  /**
   * NOTE: not typing Orders to avoid cirular references (and the property is not needed)
   */
  // Orders: Order[];
  /**
   * NOTE: not typing Proposals to avoid cirular references (and the property is not needed)
   */
  // Proposals: Proposal[];
  PurchaseOrdersEnabled: boolean;
  PayLaterEnabled: boolean;
  Timeline: TimelineEntry;
  TierId: number | null;
  Tiers: Tier[];
  IsTaxable: boolean;
  FirstName: string;
  LastName: string;
  JobTitle: string;
  Email: string;
  Phones: Phone[];
  ProfilePicture: string;
  Newsletter: boolean;
  Tags: Tag[];
  Store: Contact.StoreSummary;
  Origin: Origin;
  /**
   * NOTE: not typing Company to avoid circular references (and the property is not needed)
   */
  // Company: Company;
  PrimaryAddressId: number | null;
  Addresses: Address[];
  Discount: number | null;
  BirthDate: Date | null;
  DateCreated: Date;
  LastModified: Date;
  ExternalReferenceId: string;
}

export namespace Contact {
  export interface StoreSummary {
    ID: number;
    Name: string;
    Logo: string;
    AcceptPurchaseOrder: boolean;
    AllowPaymentLater: boolean;
  }
}
