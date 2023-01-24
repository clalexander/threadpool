export type PrintfulWebhookServiceEventType =
  | 'service.printful_webhook.failed'
  | 'service.printful_webhook.received_unauthorized_request'
  | 'service.printful_webhook.received_invalid_event';
