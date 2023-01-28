import { aws, CronHandler } from 'aws-utils';
import { SummaryEventsData } from 'data-stores';
import { Event, EventType, publishEvent } from 'event-utils';
import { Order } from 'inksoft';
import mustache from 'mustache';
import {
  OUTPUT_TIMEZONE,
  SNS_EMAIL_NOTIFICATIONS_ARN,
  SOURCE_PRINTFUL,
  SOURCE_THREADPOOL,
  SUMMARY_EVENTS_TABLE_NAME,
  TARGET_EVENTBRIDGE_ARN,
} from './constants';
import { EMAIL_BODY, EMAIL_SUBJECT } from './templates';
import { dateToStr } from './utils';

const ONE_DAY_OFFSET_TIME = 24 * 60 * 60 * 1000;

const summaryEventsData = new SummaryEventsData(SUMMARY_EVENTS_TABLE_NAME);
const sns = aws().sns();

interface SystemIssue {
  service: string;
  count: number;
}

interface EmailData {
  date: string;
  startTime: string;
  endTime: string;
  ordersCount: number;
  ordersSentCount: number;
  orderVolume: string;
  itemsCount: number;
  shipmentsCount: number;
  shipmentsWrittenBackCount: number;
  hasIssues: boolean;
  issues: SystemIssue[];
}

const eventHandler = async () => {
  const exeStart = new Date();
  // lifecycle: service started
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: 'service.daily_summary.started',
  });
  const end = new Date(exeStart);
  end.setMinutes(0);
  end.setSeconds(0);
  end.setMilliseconds(0);
  const start = new Date(end.getTime() - ONE_DAY_OFFSET_TIME);
  const allEvents = await summaryEventsData.scanItems({
    start,
    end,
  });
  const eventsMap: Record<string, Record<EventType, Event[]>> = {};
  allEvents.forEach((event) => {
    const { source, type } = event;
    if (eventsMap[source] === undefined) {
      eventsMap[source] = {} as Record<EventType, Event[]>;
    }
    if (eventsMap[source][type] === undefined) {
      eventsMap[source][type] = [];
    }
    eventsMap[source][type].push(event);
  });
  const threadpoolEventsMap = eventsMap[SOURCE_THREADPOOL] || {};
  const printfulEventsMap = eventsMap[SOURCE_PRINTFUL] || {};
  // email data
  const date = end.toLocaleDateString(undefined, { dateStyle: 'short', timeZone: OUTPUT_TIMEZONE });
  const startTime = dateToStr(start);
  const endTime = dateToStr(end);
  const newOrders: Event<Order>[] = (threadpoolEventsMap['inksoft.order.received'] || []) as unknown as Event<Order>[];
  const ordersCount = newOrders.length;
  const ordersSentCount = (threadpoolEventsMap['printful.order.created'] || []).length;
  let orderVolumeSum = 0;
  let itemsCount = 0;
  newOrders.forEach((event) => {
    const order = event.data;
    orderVolumeSum += order.AmountDue;
    itemsCount += order.Items
      .reduce((acc, item) => acc + item.Quantity, 0);
  });
  const orderVolume = orderVolumeSum.toLocaleString(undefined, {
    style: 'currency',
    currency: 'usd',
  });
  const shipmentsCount = (printfulEventsMap.package_shipped || []).length;
  const shipmentsWrittenBackCount = (threadpoolEventsMap['inksoft.order.shipment_created'] || []).length;
  const issueKeys = (Object.keys(threadpoolEventsMap) as EventType[])
    .filter((key) => key.includes('failed'));
  const issues: SystemIssue[] = issueKeys
    .map((key) => ({
      // assumes event follows pattern: service.<service>.failed
      service: key.split('.')[1],
      count: threadpoolEventsMap[key].length,
    }));
  const hasIssues = issues.length > 0;
  const emailData: EmailData = {
    date,
    startTime,
    endTime,
    ordersCount,
    ordersSentCount,
    itemsCount,
    orderVolume,
    shipmentsCount,
    shipmentsWrittenBackCount,
    hasIssues,
    issues,
  };
  const subject = mustache.render(EMAIL_SUBJECT, emailData);
  const message = mustache.render(EMAIL_BODY, emailData);
  const params = {
    TopicArn: SNS_EMAIL_NOTIFICATIONS_ARN,
    Subject: subject,
    Message: message,
  };
  const request = sns.publish(params);
  await request.promise();
  // lifecycle: service completed
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: 'service.daily_summary.completed',
  });
};

const errorHandler = async (error: any) => {
  // lifecycle: service failed
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: 'service.daily_summary.failed',
    data: error,
  });
  return false;
};

export const handler = CronHandler(eventHandler, { errorHandler });
