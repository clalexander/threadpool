import { CronHandler } from 'aws-utils';
import { publishEvent } from 'event-utils';
import { inksoft, OrderSummariesListOptions, OrderSummary } from 'inksoft';
import { TARGET_EVENTBRIDGE_ARN } from './constants';
import { OrderSummaryEventType, ServiceEventType } from './events';
import { getMinStartTime, getStartOffset } from './parameters';
import { getState, setState } from './state';

const eventHandler = async () => {
  // save start time to update last fetch time after fetch complete
  const startTime = new Date().getTime() / 1000;
  // lifecycle: service started
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: ServiceEventType.Started,
  });
  // get effective start time = (earliest start time || last start time) - start time offset
  const state = await getState();
  const lastStartTime = state?.lastStartTime;
  const minStartTime = await getMinStartTime();
  const startOffset = await getStartOffset();
  const beginTime = Math.max(minStartTime || 0, lastStartTime || 0) || null;
  const begin = beginTime && new Date((beginTime - startOffset) * 1000);
  const utcOffset = new Date().getTimezoneOffset() / 60;
  const listOptions: OrderSummariesListOptions = begin ? {
    DateCreatedRange: {
      UtcOffsetHours: utcOffset,
      Begin: begin,
    },
  } : {};
  const orderSummaries: OrderSummary[] = [];
  let index = 0;
  let total = 0;
  const client = await inksoft();
  do {
    // eslint-disable-next-line no-await-in-loop
    const response = await client.orders.listSummaries({
      ...listOptions,
      Index: index,
    });
    const data = response.Data;
    if (data === false) {
      throw new Error('Invalid response data (false) from list summaries.');
    }
    orderSummaries.push(...data);
    total = response.Pagination?.TotalResults || 0;
    index += response.Pagination?.IncludedResults || 0;
  } while (index < total);
  // produce order summary events
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: OrderSummaryEventType.Received,
    data: orderSummaries,
    publishSeparateEvents: true,
  });
  // save last start time
  await setState({ lastStartTime: startTime });
  // lifecycle: service completed
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: ServiceEventType.Completed,
  });
};

const errorHandler = async (error: any) => {
  // lifecycle: service failed
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: ServiceEventType.Failed,
    data: error,
  });
  return false;
};

export const handler = CronHandler(eventHandler, { errorHandler });
