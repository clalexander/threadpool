export interface AdditionalRequestOptions {
  omitApiKey?: boolean;
}

export interface ListOptions {
  Index?: number;
  MaxResults?: number;
}

export type OrderByDirection = 'Ascending' | 'Descending';

export interface OrderingOptions<T extends string> {
  OrderBy?: T;
  OrderByDirection?: OrderByDirection;
}
