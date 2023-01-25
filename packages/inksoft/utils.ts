import { encode } from 'api-client';

export function serialize(data: any): string {
  if (!data || typeof data !== 'object') {
    return '';
  }
  const parts: string[] = [];
  const pushPart = (key: string, value: string | number | boolean | Date) => {
    let v = value;
    if (v instanceof Date) {
      v = v.toISOString();
    }
    parts.push(`${encode(key)}=${encode(v)}`);
  };
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      pushPart(key, `[${value.join(',')}]`);
    } else if (typeof value === 'object' && value !== null) {
      pushPart(key, JSON.stringify(value));
    } else {
      pushPart(key, value as string | number | boolean);
    }
  });
  return parts.join('&');
}
