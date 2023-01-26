import { InkSoftOrderEventType } from './order';
import { InkSoftOrderSummaryEventType } from './order-summary';

export type InkSoftEventType =
  | InkSoftOrderSummaryEventType
  | InkSoftOrderEventType;
