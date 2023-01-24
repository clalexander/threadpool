/* eslint-disable no-console */
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
  Context,
} from 'aws-lambda';
import SuperJSON from 'superjson';
import { defaultBodyParser } from './body-parsers';

export interface APIGatewayHandlerOptions<T = any> {
  bodyParser?: (body: string) => T;
  errorHandler?: (error: any) => Promise<APIGatewayProxyResultV2 | null>;
  dataRedact?: (data: T) => void;
  eventRedact?: (event: APIGatewayProxyEventV2) => void;
}

export type ApiGatewayEventHandler<T> = (
  data: T | null,
  event: APIGatewayProxyEventV2,
  context: Context
) => Promise<APIGatewayProxyResultV2>;

const defaultServerError: APIGatewayProxyResultV2 = {
  statusCode: 500,
  body: 'Internal Server Error',
};

export const APIGatewayHandler = <T>(
  eventHandler: ApiGatewayEventHandler<T>,
  options?: APIGatewayHandlerOptions<T>,
): APIGatewayProxyHandlerV2 => async (
    event: APIGatewayProxyEventV2,
    context: Context,
  ): Promise<APIGatewayProxyResultV2> => {
    const {
      bodyParser = defaultBodyParser,
      errorHandler,
      dataRedact,
      eventRedact,
    } = options || {};
    let data: T | null = null;
    try {
      const { body } = event;
      if (body) {
        data = bodyParser(body);
      }
    } catch (error: any) {
      if (eventRedact) {
        eventRedact(event);
      }
      console.error('BODY PARSE ERROR!');
      console.error(`${error.name}: ${error.message} ${SuperJSON.stringify(error)}`, error.stack || 'No stack');
      console.error(`Event: ${SuperJSON.stringify(event)}`);
      console.error(`Context: ${SuperJSON.stringify(context)}`);
      return defaultServerError;
    }
    // try to handle event
    try {
      return await eventHandler(data, event, context);
    } catch (error: any) {
      const errorResult = (errorHandler && await (errorHandler(error)));
      if (errorResult) {
        return errorResult;
      }
      // redact data
      if (dataRedact && data) {
        dataRedact(data);
      }
      if (eventRedact) {
        eventRedact(event);
      }
      console.error('EVENT ERROR!');
      console.error(`${error.name}: ${error.message} ${SuperJSON.stringify(error)}`, error.stack || 'No stack');
      console.error(`Data: ${SuperJSON.stringify(data)}`);
      console.error(`Event: ${SuperJSON.stringify(event)}`);
      console.error(`Context: ${SuperJSON.stringify(context)}`);
      return defaultServerError;
    }
  };
