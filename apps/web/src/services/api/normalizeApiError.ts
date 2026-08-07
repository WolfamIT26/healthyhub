import type { ApiErrorEnvelope } from '@healthyhub/shared-types';
import axios from 'axios';

export interface NormalizedApiError {
  message: string;
  statusCode?: number;
  code?: string;
  requestId?: string;
  traceId?: string;
  original: unknown;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data;
    if (isApiErrorEnvelope(payload)) {
      return fromEnvelope(payload, error);
    }

    return {
      message: 'Không thể kết nối máy chủ. Vui lòng thử lại sau.',
      statusCode: error.response?.status,
      original: error,
    };
  }

  if (isObjectRecord(error) && typeof error.message === 'string') {
    return {
      message: error.message,
      original: error,
    };
  }

  return {
    message: 'Đã có lỗi không xác định.',
    original: error,
  };
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  return (
    isObjectRecord(value) &&
    value.success === false &&
    value.status === 'error' &&
    typeof value.message === 'string' &&
    isObjectRecord(value.error) &&
    typeof value.error.code === 'string'
  );
}

function fromEnvelope(envelope: ApiErrorEnvelope, original: unknown): NormalizedApiError {
  return {
    message: getFriendlyMessage(envelope.error.code, envelope.message),
    statusCode:
      axios.isAxiosError(original) && typeof original.response?.status === 'number'
        ? original.response.status
        : undefined,
    code: envelope.error.code,
    requestId: envelope.requestId,
    traceId: envelope.traceId,
    original,
  };
}

function getFriendlyMessage(code: string, fallback: string): string {
  const messages: Record<string, string> = {
    'AUTH.AUTHENTICATION.INVALID_CREDENTIALS': 'Email hoặc mật khẩu không chính xác.',
    'BUSINESS.AUTHENTICATION.ACCOUNT_LOCKED': 'Không thể đăng nhập. Vui lòng thử lại sau.',
    'BUSINESS.AUTHENTICATION.ACCOUNT_DISABLED': 'Không thể đăng nhập. Vui lòng thử lại sau.',
    'CONFLICT.AUTHENTICATION.EMAIL_ALREADY_EXISTS': 'Email này đã được sử dụng.',
    'AUTH.AUTHENTICATION.RESET_TOKEN_INVALID': 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
    'AUTH.AUTHENTICATION.TOKEN_INVALID': 'Liên kết xác minh không hợp lệ hoặc đã hết hạn.',
    'PERMISSION.AUTHENTICATION.DENIED': 'Bạn không có quyền truy cập nội dung này.',
    'RATE_LIMIT.AUTHENTICATION.EXCEEDED': 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.',
  };
  return messages[code] ?? fallback ?? 'Đã xảy ra lỗi. Vui lòng thử lại.';
}
