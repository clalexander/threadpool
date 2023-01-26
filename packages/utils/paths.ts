import { Paths } from 'types';

export function flattenPaths(paths: Paths): string[] {
  if (Array.isArray(paths)) {
    return paths
      .map((path) => (typeof path === 'string' ? path : flattenPaths(path)))
      .flat();
  }
  return Object.entries(paths)
    .map(([key, value]) => flattenPaths(value)
      .map((path) => [key, path].join('.')))
    .flat();
}
