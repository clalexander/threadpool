import { ExternalEventType } from './external';
import { InkSoftEventType } from './inksoft';
import { PrintfulEventType } from './printful';
import { ServiceEventType } from './service';

export type EventType =
  | InkSoftEventType
  | PrintfulEventType
  | ServiceEventType
  | ExternalEventType;
