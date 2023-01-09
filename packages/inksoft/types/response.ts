export interface Response<T> {
  OK: boolean;
  StatusCode: Response.StatusCode;
  Data: false | T;
  Pagination: Response.Pagination | null;
  Messages: Response.Message[];
}

export namespace Response {
  export type StatusCode = 'OK' | 'BadRequest' | 'NotFound' | 'InternalServerError';

  export interface Pagination {
    TotalResult: number;
    IncludedResults: number;
    Index: number;
  }

  export interface Message {
    Content: string;
    Title: string | null;
    Serverity: string;
  }
}
