export function parseEnvInt(name: string): number | undefined {
  const rawValue = process.env[name] || '';
  const result = Number.parseInt(rawValue, 10);
  if (Number.isInteger(result)) {
    return result;
  }
  return undefined;
}

export function parseEnvFloat(name: string): number | undefined {
  const rawValue = process.env[name] || '';
  const result = Number.parseInt(rawValue, 10);
  if (Number.isFinite(result)) {
    return result;
  }
  return undefined;
}
