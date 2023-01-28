import { WebhookEvent } from './webhook-event';

export interface WebhookInfo {
  url: string;
  types: string[];
  params: Record<string, any> | []; // am empty array is returned when there are no params
}

export interface WebhookSetup {
  url: string;
  types: WebhookEvent.Type[];
  params?: Record<WebhookEvent.Type, any>;
}
