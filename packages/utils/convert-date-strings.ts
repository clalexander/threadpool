export function convertDateStrings(data: any): any {
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
        return data.map(convertDateStrings);
      }
      return Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = convertDateStrings(value);
        return acc;
      }, {} as any);
    default:
      return data;
  }
}

function maybeTransformDateString(str: string): string | Date {
  try {
    const dateParsed = new Date(str);
    if (dateParsed instanceof Date && dateParsed.toISOString() === str) {
      return dateParsed;
    }
  } catch (error) { /* empty */ }
  return str;
}
