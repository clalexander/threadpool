import { Event, makeEventRedact } from 'event-utils';
import { redactPaths } from './redact-paths';

export function eventKey(event: Event): string {
  const { id, source } = event;
  if (id === undefined) {
    throw new Error('Event missing id');
  }
  const created = new Date(event.created);
  const year = created.getUTCFullYear();
  const month = zeroPad(created.getUTCMonth() + 1, 2);
  const day = zeroPad(created.getUTCDate(), 2);
  const hour = zeroPad(created.getUTCHours(), 2);
  const minute = zeroPad(created.getUTCMinutes(), 2);
  return [
    'raw-files',
    source,
    year,
    month,
    day,
    hour,
    minute,
    id,
  ].join('/');
}

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

export function eventMetadata(event: Event): Record<string, string> {
  const {
    source,
    type,
    environment,
  } = event;
  return {
    source,
    type,
    environment,
  };
}

export const eventRedact = makeEventRedact((event: Event) => {
  const { source } = event;
  return redactPaths[source] || [];
});
