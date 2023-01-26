/* eslint-disable no-console */
import { Context } from 'aws-lambda';
import { safeStringify } from 'utils';

export interface CronHandlerOptions {
  errorHandler?: (error: any) => Promise<boolean>;
}

export const CronHandler = <T>(
  eventHandler: (data: T) => Promise<any>,
  options?: CronHandlerOptions,
) => async (data: T, context: Context) => {
    const { errorHandler } = options || {};
    try {
      await eventHandler(data);
    } catch (error: any) {
      if (errorHandler === undefined || !(await errorHandler(error))) {
        console.error('EVENT ERROR!');
        console.error(`${error.name}: ${error.message} ${safeStringify(error)}`, error.stack || 'No stack');
        console.error(`Data: ${safeStringify(data)}`);
        console.error(`Context: ${safeStringify(context)}`);
      }
    }
    return true;
  };
