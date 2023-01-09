export interface Address {
  ID: number;
  StateId: number | null;
  CountryId: number | null;
  Business: boolean;
  TaxExempt: boolean;
  FirstName: string;
  LastName: string;
  Name: string;
  CompanyName: string;
  Street1: string;
  Street2: string;
  City: string;
  State: string;
  StateName: string;
  Country: string;
  CountryCode: string;
  Phone: string;
  Fax: string;
  PostCode: string;
  POBox: boolean;
  SaveToAddressBook: boolean;
  Type: string;
  TaxId: string;
  Department: string;
  Validated: boolean;
  IsPrimaryAddress: boolean;
  SingleLine: string;
}
