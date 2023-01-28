/* eslint-disable no-console */
import {
  Context,
  DynamoDBBatchItemFailure,
  DynamoDBRecord,
  DynamoDBStreamEvent,
  DynamoDBStreamHandler as AWSDynamoDBStreamHandler,
} from 'aws-lambda';
import { safeStringify } from 'utils';

export interface DynamoDBStreamHandlerOptions {
  errorHandler?: (error: any) => Promise<boolean>;
}

export type DynamoDBStreamRecordHandler = (record: DynamoDBRecord) => Promise<any>;

export const DynamoDBStreamHandler = (
  recordHandler: DynamoDBStreamRecordHandler,
  options?: DynamoDBStreamHandlerOptions,
): AWSDynamoDBStreamHandler => async (event: DynamoDBStreamEvent, context: Context) => {
  const batchItemFailures: DynamoDBBatchItemFailure[] = [];
  const { errorHandler } = options || {};
  const processingPromises = event.Records.map(async (record) => {
    try {
      await recordHandler(record);
    } catch (error: any) {
      if (errorHandler === undefined || !(await errorHandler(error))) {
        console.error('EVENT ERROR!');
        console.error(`${error.name}: ${error.message} ${safeStringify(error)}`, error.stack || 'No stack');
        console.error(`Record: ${safeStringify(record)}`);
        console.error(`Context: ${safeStringify(context)}`);
        const { eventID } = record;
        if (eventID) {
          batchItemFailures.push({ itemIdentifier: eventID });
        }
      }
    }
  });
  await Promise.all(processingPromises);
  return { batchItemFailures };
};
