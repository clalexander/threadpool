import { DailySummaryServiceEventType } from './daily-summary';
import { InkSoftOrderShipmentsWritebackServiceEventType } from './inksoft-order-shipments-writeback';
import { InkSoftOrderSummaryTranslatorServiceEventType } from './inksoft-order-summary-translator';
import { InkSoftOrderSyncServiceEventType } from './inksoft-orders-sync';
import { PrintfulOrderFulfillmentServiceEventType } from './printful-order-fulfillment';
import { PrintfulWebhookServiceEventType } from './printful-webhook';

export type ServiceEventType =
  | InkSoftOrderSyncServiceEventType
  | InkSoftOrderSummaryTranslatorServiceEventType
  | InkSoftOrderShipmentsWritebackServiceEventType
  | PrintfulOrderFulfillmentServiceEventType
  | PrintfulWebhookServiceEventType
  | DailySummaryServiceEventType;
