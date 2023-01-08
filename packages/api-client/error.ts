/* eslint-disable max-classes-per-file */
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';

export class ApiError<T = unknown, D = any> extends Error {
  public readonly code?: string;

  public readonly request?: any;

  public readonly response?: AxiosResponse<T, D>;

  constructor(public readonly raw: AxiosError<T, D>) {
    super(raw.message);
    this.code = raw.code;
    this.request = raw.request;
    this.response = raw.response;
  }

  static generate<T = unknown, D = any>(rawError: AxiosError<T, D>): ApiError<T, D> {
    if (rawError.response) {
      switch (rawError.response.status) {
        case HttpStatusCode.BadRequest:
          return new BadRequestApiError(rawError);
        case HttpStatusCode.Unauthorized:
          return new UnauthorizedApiError(rawError);
        case HttpStatusCode.Forbidden:
          return new ForbiddenApiError(rawError);
        case HttpStatusCode.NotFound:
          return new NotFoundApiError(rawError);
        case HttpStatusCode.Conflict:
          return new ConflictApiError(rawError);
        case HttpStatusCode.InternalServerError:
          return new InternalServerApiError(rawError);
        case HttpStatusCode.BadGateway:
          return new BadGatewayApiError(rawError);
        case HttpStatusCode.GatewayTimeout:
          return new GatewayTimeoutApiError(rawError);
        default:
          break;
      }
    } else if (rawError.request) {
      switch (rawError.code) {
        case AxiosError.ERR_FR_TOO_MANY_REDIRECTS:
          return new TooManyRedirectsApiError(rawError);
        case AxiosError.ERR_BAD_OPTION_VALUE:
        case AxiosError.ERR_BAD_OPTION:
          return new BadOptionApiError(rawError);
        case AxiosError.ERR_NETWORK:
          return new NetworkApiError(rawError);
        case AxiosError.ERR_DEPRECATED:
          return new DeprecatedApiError(rawError);
        case AxiosError.ERR_BAD_RESPONSE:
          return new BadResponseApiError(rawError);
        case AxiosError.ERR_INVALID_URL:
          return new InvalidURLApiError(rawError);
        case AxiosError.ERR_CANCELED:
          return new CanceledApiError(rawError);
        case AxiosError.ECONNABORTED:
          return new ConnectionAbortedApiError(rawError);
        case AxiosError.ETIMEDOUT:
          return new TimeoutApiError(rawError);
        default:
          break;
      }
    }
    return new UnknownApiError(rawError);
  }
}

export class BadRequestApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class UnauthorizedApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class ForbiddenApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class NotFoundApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class ConflictApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class InternalServerApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class BadGatewayApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class GatewayTimeoutApiError<T = unknown, D = any> extends ApiError<T, D> {}

export class TooManyRedirectsApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class BadOptionApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class NetworkApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class DeprecatedApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class BadResponseApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class InvalidURLApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class CanceledApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class ConnectionAbortedApiError<T = unknown, D = any> extends ApiError<T, D> {}
export class TimeoutApiError<T = unknown, D = any> extends ApiError<T, D> {}

export class UnknownApiError<T = unknown, D = any> extends ApiError<T, D> {}
