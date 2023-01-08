import { encode } from 'api-client';
import { JsonValue } from 'types';

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

export function transformResponse(data: JsonValue): any {
  switch (typeof data) {
    case 'number':
    case 'boolean':
      return data;
    case 'string':
      return maybeTransformDateString(data);
    case 'object':
      if (data === null) {
        return data;
      }
      if (Array.isArray(data)) {
        return data.map(transformResponse);
      }
      return Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = transformResponse(value);
        return acc;
      }, {} as any);
    default:
      return data;
  }
}

function maybeTransformDateString(str: string): string | Date {
  const dateParsed = new Date(str);
  if (dateParsed instanceof Date && dateParsed.toISOString() === str) {
    return dateParsed;
  }
  return str;
}
