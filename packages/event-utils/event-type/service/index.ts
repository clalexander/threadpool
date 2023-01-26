import { DailySummaryServiceEventType } from './daily-summary';
import { InkSoftOrderSummaryTranslatorServiceEventType } from './inksoft-order-summary-translator';
import { InkSoftOrderSyncServiceEventType } from './inksoft-orders-sync';
import { PrintfulOrderFulfillmentServiceEventType } from './printful-order-fulfillment';

export type ServiceEventType =
  | InkSoftOrderSyncServiceEventType
  | InkSoftOrderSummaryTranslatorServiceEventType
  | PrintfulOrderFulfillmentServiceEventType
  | DailySummaryServiceEventType;
