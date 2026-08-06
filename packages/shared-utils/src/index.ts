import type { ApiEnvelope, ApiErrorEnvelope } from '@healthyhub/shared-types';

export function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isApiEnvelope(value: unknown): value is ApiEnvelope {
  return (
    isObjectRecord(value) &&
    typeof value.success === 'boolean' &&
    typeof value.status === 'string' &&
    typeof value.requestId === 'string' &&
    typeof value.traceId === 'string'
  );
}

export function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  return isApiEnvelope(value) && value.success === false && value.status === 'error';
}

export function createBrowserRequestId(prefix = 'req'): string {
  const randomValue =
    globalThis.crypto && 'randomUUID' in globalThis.crypto
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}_${randomValue}`;
}

export function redactSensitiveKeys<T>(value: T, keys: string[]): T {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveKeys(item, keys)) as T;
  }

  if (!isObjectRecord(value)) {
    return value;
  }

  const normalizedKeys = keys.map((key) => key.toLowerCase());
  const redacted: Record<string, unknown> = {};

  for (const [key, entryValue] of Object.entries(value)) {
    const shouldRedact = normalizedKeys.some((sensitiveKey) =>
      key.toLowerCase().includes(sensitiveKey),
    );
    redacted[key] = shouldRedact ? '[REDACTED]' : redactSensitiveKeys(entryValue, keys);
  }

  return redacted as T;
}
