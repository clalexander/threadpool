export type InkSoftOrderSyncEventType =
  | 'inksoft.orders_sync.started'
  | 'inksoft.orders_sync.completed'
  | 'inksoft.orders_sync.failed';

export type InkSoftOrderSummaryEventType =
  | 'inksoft.order_summary.fetched';

export type EventType =
  | InkSoftOrderSyncEventType
  | InkSoftOrderSummaryEventType;
