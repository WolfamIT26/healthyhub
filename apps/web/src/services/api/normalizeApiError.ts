import type { ApiErrorEnvelope } from '@healthyhub/shared-types';
import { isApiErrorEnvelope, isObjectRecord } from '@healthyhub/shared-utils';
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

function fromEnvelope(envelope: ApiErrorEnvelope, original: unknown): NormalizedApiError {
  return {
    message: envelope.message,
    code: envelope.error.code,
    requestId: envelope.requestId,
    traceId: envelope.traceId,
    original,
  };
}
