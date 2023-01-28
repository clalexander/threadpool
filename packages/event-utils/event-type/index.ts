import { ExternalEventType } from './external';
import { InkSoftEventType } from './inksoft';
import { InternalEventType } from './internal';
import { PrintfulEventType } from './printful';
import { ServiceEventType } from './service';

export type EventType =
  | InkSoftEventType
  | PrintfulEventType
  | ServiceEventType
  | InternalEventType
  | ExternalEventType;
