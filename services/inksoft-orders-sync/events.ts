export enum ServiceEventType {
  Started = 'inksoft_orders_sync.service.started',
  Completed = 'inksoft_orders_sync.service.completed',
  Failed = 'inksoft_orders_sync.service.failed',
}

export enum OrderSummaryEventType {
  Received = 'inksoft.order_summary.received',
}
