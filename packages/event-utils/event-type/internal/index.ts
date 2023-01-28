import { PrintfulWebhookConfigEventType } from './printful-webhook-config';
import { StoresMapEventType } from './stores-map';

export type InternalEventType =
  | StoresMapEventType
  | PrintfulWebhookConfigEventType;
