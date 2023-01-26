export interface Response<T> {
  code: number;
  result: T;
}

export interface PagedResponse<T> extends Response<T> {
  paging: Response.Paging;
}

export interface ErrorResponse extends Response<string> {
  error: Response.Error;
}

export namespace Response {
  export interface Paging {
    total: number;
    offset: number;
    limit: number;
  }

  export interface Error {
    reason: string;
    message: string;
  }
}
