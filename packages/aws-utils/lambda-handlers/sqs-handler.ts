/* eslint-disable no-console */
import {
  Context,
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from 'aws-lambda';
import SuperJSON from 'superjson';
import { defaultBodyParser } from './body-parsers';

export interface SQSHandlerOptions<T = any> {
  bodyParser?: (body: string) => T;
  errorHandler?: (error: any) => Promise<boolean>;
  eventRedact?: (event: T) => void;
}

export const SQSHandler = <T>(
  eventHandler: (event: T) => Promise<any>,
  options?: SQSHandlerOptions<T>,
) => async (sqsEvent: SQSEvent, context: Context): Promise<SQSBatchResponse> => {
    const batchItemFailures: SQSBatchItemFailure[] = [];
    const bodyParser = options?.bodyParser || defaultBodyParser;
    const errorHandler = options?.errorHandler;
    const eventProcessingPromises = sqsEvent.Records.map(async (record) => {
      let event: T;
      // try to parse event body
      try {
        event = bodyParser(record.body);
      } catch (error: any) {
        console.error('EVENT BODY PARSE ERROR!');
        console.error(`${error.name}: ${error.message} ${SuperJSON.stringify(error)}`, error.stack || 'No stack');
        console.error(`Record: ${SuperJSON.stringify(record)}`);
        console.error(`Context: ${SuperJSON.stringify(context)}`);
        batchItemFailures.push({ itemIdentifier: record.messageId });
        return;
      }
      // try to handle event
      try {
        await eventHandler(event);
      } catch (error: any) {
        if (errorHandler === undefined || !(await errorHandler(error))) {
        // redact event
          const { eventRedact } = options || {};
          if (eventRedact) {
            eventRedact(event);
          }
          console.error('EVENT ERROR!');
          console.error(`${error.name}: ${error.message} ${SuperJSON.stringify(error)}`, error.stack || 'No stack');
          console.error(`Event: ${SuperJSON.stringify(event)}`);
          console.error(`Message attributes: ${SuperJSON.stringify(record.messageAttributes)}`);
          console.error(`Context: ${SuperJSON.stringify(context)}`);
          batchItemFailures.push({ itemIdentifier: record.messageId });
        }
      }
    });
    await Promise.all(eventProcessingPromises);
    return { batchItemFailures };
  };
