export const HEALTHYHUB_APP_NAME = 'HealthyHub';
export const API_PREFIX = '/api/v1';
export const API_DOCS_PATH = '/api/docs';
export const CONTRACT_VERSION = 'v1';
export const DEFAULT_LOCALE = 'vi-VN';
export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

export const REQUEST_HEADER = {
  requestId: 'x-request-id',
  traceId: 'x-trace-id',
  acceptLanguage: 'accept-language',
  idempotencyKey: 'x-idempotency-key',
} as const;

export const RESPONSE_HEADER = {
  requestId: 'X-Request-Id',
  traceId: 'X-Trace-Id',
} as const;

export const SENSITIVE_LOG_KEYS = [
  'password',
  'token',
  'authorization',
  'cookie',
  'secret',
  'apiKey',
] as const;
