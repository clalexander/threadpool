export interface Phone {
  ID: number;
  Number: string;
  Extension: string;
  PhoneType: Phone.Type;
  IsSMSOptOut: boolean;
}

export namespace Phone {
  export type Type = 'Mobile' | 'Work' | 'Home';
}
