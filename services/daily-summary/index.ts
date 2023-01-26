import { aws, CronHandler } from 'aws-utils';
import { SummaryEventsData } from 'data-stores';
import { Event, EVENT_OBJECT, publishEvent } from 'event-utils';
import { Order } from 'inksoft';
import mustache from 'mustache';
import {
  OUTPUT_TIMEZONE,
  SNS_EMAIL_NOTIFICATIONS_ARN,
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
  const allEvents = await summaryEventsData.queryItems({
    start,
    end,
    object: EVENT_OBJECT,
  });
  const eventsMap: Record<string, Event[]> = {};
  allEvents.forEach((event) => {
    const { type } = event;
    if (eventsMap[type] === undefined) {
      eventsMap[type] = [];
    }
    eventsMap[type].push(event);
  });
  // email data
  const date = end.toLocaleDateString(undefined, { dateStyle: 'short', timeZone: OUTPUT_TIMEZONE });
  const startTime = dateToStr(start);
  const endTime = dateToStr(end);
  const newOrders: Event<Order>[] = (eventsMap['inksoft.order.received'] || []) as unknown as Event<Order>[];
  const ordersCount = newOrders.length;
  const ordersSentCount = (eventsMap['printful.order.sent'] || []).length;
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
  const issueKeys = Object.keys(eventsMap)
    .filter((key) => key.includes('failed'));
  const issues: SystemIssue[] = issueKeys
    .map((key) => ({
      // assumes event follows pattern: service.<service>.failed
      service: key.split('.')[1],
      count: eventsMap[key].length,
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
