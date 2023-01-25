/* eslint-disable no-console */
import {
  Context,
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from 'aws-lambda';
import { safeStringify } from 'utils';
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
        console.error(`${error.name}: ${error.message} ${safeStringify(error)}`, error.stack || 'No stack');
        console.error(`Record: ${safeStringify(record)}`);
        console.error(`Context: ${safeStringify(context)}`);
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
          console.error(`${error.name}: ${error.message} ${safeStringify(error)}`, error.stack || 'No stack');
          console.error(`Event: ${safeStringify(event)}`);
          console.error(`Message attributes: ${safeStringify(record.messageAttributes)}`);
          console.error(`Context: ${safeStringify(context)}`);
          batchItemFailures.push({ itemIdentifier: record.messageId });
        }
      }
    });
    await Promise.all(eventProcessingPromises);
    return { batchItemFailures };
  };
