export function encode(val: string | number | boolean) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

// eslint-disable-next-line max-len
export function paramsSerializer(params?: Record<string, string | number | boolean | Date>): string {
  if (!params || typeof params !== 'object') {
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
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => pushPart(`${key}[]`, val));
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([k, v]) => pushPart(`${key}[${k}]`, v));
    } else {
      pushPart(key, value);
    }
  });
  return parts.join('&');
}

export const buildBearerAuthHeader = (token: string) => `Bearer ${token}`;
