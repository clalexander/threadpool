export const safeStringify = (data: any, space = 2) => {
  const cache = new Set();
  return JSON.stringify(data, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return '[Circular]';
      }
      cache.add(value);
    }
    return value;
  }, space);
};
