export interface GiftCertificate {
  Amount: number;
  AppliedAmount: number | null;
  InitialPurchaseAmount: number;
  Created: Date;
  DateSent: Date | null;
  HasOrders: boolean;
  Number: string;
  ToName: string;
  ToEamil: string;
}
