import FastRedact from 'fast-redact';
import { Paths } from 'types';
import { flattenPaths } from './paths';

export type RedactPaths = Paths | ((data: any) => Paths);

export function makeRedact(redactPaths: RedactPaths) {
  return (data: any) => {
    const pathsStructure = typeof redactPaths === 'function' ? redactPaths(data) : redactPaths;
    const paths = flattenPaths(pathsStructure);
    const redact = FastRedact({ paths, serialize: false });
    redact(data);
  };
}
