import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { normalizeApiError } from './normalizeApiError';

vi.mock('axios', () => ({ default: { isAxiosError: vi.fn() } }));

describe('normalizeApiError', () => {
  it('normalizes network errors without exposing raw details', () => {
    vi.mocked(axios.isAxiosError).mockReturnValue(true);
    expect(normalizeApiError({ response: undefined })).toMatchObject({
      message: 'Không thể kết nối máy chủ. Vui lòng thử lại sau.',
    });
  });

  it.each([
    ['PERMISSION.AUTHENTICATION.DENIED', 403, 'Bạn không có quyền truy cập nội dung này.'],
    ['AUTH.AUTHENTICATION.TOKEN_INVALID', 401, 'Liên kết xác minh không hợp lệ hoặc đã hết hạn.'],
  ])('maps %s safely', (code, status, message) => {
    vi.mocked(axios.isAxiosError).mockReturnValue(true);
    const original = {
      response: {
        status,
        data: {
          success: false,
          status: 'error',
          message: 'raw',
          data: null,
          error: { code, category: 'AUTH', message: 'raw', retryable: false },
          metadata: {
            timestamp: new Date().toISOString(),
            timezone: 'Asia/Ho_Chi_Minh',
            locale: 'vi-VN',
          },
          requestId: 'req_1',
          traceId: 'trace_1',
          contractVersion: 'v1',
        },
      },
    };
    expect(normalizeApiError(original)).toMatchObject({ message, statusCode: status, code });
  });
});
