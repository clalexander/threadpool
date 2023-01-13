export type InkSoftOrderSyncEventType =
  | 'inksoft.order_sync.started'
  | 'inksoft.order_sync.completed'
  | 'inksoft.order_sync.failed';

export type InkSoftOrderSummaryEventType =
  | 'inksoft.order_summary.fetched';

export type EventType =
  | InkSoftOrderSyncEventType
  | InkSoftOrderSummaryEventType;
