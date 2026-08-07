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

export type PasswordPolicyFailure = 'length' | 'common' | 'email';

const COMMON_PASSWORDS = new Set([
  'password',
  'password123',
  'password1234',
  '123456',
  '12345678',
  '123456789012',
  'qwerty',
  'qwertyuiop12',
  'admin',
  'letmein123456',
  'healthyhub',
  'healthyhub123',
]);

export function getPasswordPolicyFailure(password: string, email?: string): PasswordPolicyFailure | undefined {
  if (password.length < 12 || password.length > 128) return 'length';

  const normalizedPassword = password.normalize('NFKC').toLocaleLowerCase('en-US');
  if (COMMON_PASSWORDS.has(normalizedPassword)) return 'common';

  if (email) {
    const normalizedEmail = email.trim().normalize('NFKC').toLocaleLowerCase('en-US');
    const separator = normalizedEmail.lastIndexOf('@');
    if (separator > 0 && separator < normalizedEmail.length - 1) {
      const localPart = normalizedEmail.slice(0, separator);
      const domain = normalizedEmail.slice(separator + 1);
      const emailTerms = new Set([
        normalizedEmail,
        domain,
        ...(localPart.length >= 3 ? [localPart] : []),
        ...domain.split('.').filter((part) => part.length >= 4),
      ]);
      if ([...emailTerms].some((term) => normalizedPassword.includes(term))) return 'email';
    }
  }

  return undefined;
}
