import FastRedact from 'fast-redact';
import { Paths } from 'types';
import { flattenPaths } from 'utils';
import { Event } from './types';

export type EventRedactPaths = Paths | ((event: Event) => Paths);

export function makeEventRedact(redactPaths: EventRedactPaths) {
  return (event: Event) => {
    const pathsStructure = typeof redactPaths === 'function' ? redactPaths(event) : redactPaths;
    const paths = flattenPaths(pathsStructure);
    const redact = FastRedact({ paths, serialize: false });
    redact(event.data);
  };
}
