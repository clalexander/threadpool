export interface LineItemNote {
  ID: number;
  OrderId: number | null;
  ProposalId: number | null;
  ArtId: number | null;
  CustomLineItemId: number | null;
  ProductStyleId: number | null;
  PersonalizationValues: string;
  Content: string;
  DateCreated: Date;
  DateModified: Date;
  UniqueId: string | null;
}
