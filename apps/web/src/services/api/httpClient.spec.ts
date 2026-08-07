import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
  requestUse: vi.fn(),
  responseUse: vi.fn(),
  request: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: () => ({
      interceptors: {
        request: { use: mocks.requestUse },
        response: { use: mocks.responseUse },
      },
      request: mocks.request,
      get: vi.fn(),
      post: vi.fn(),
    }),
    post: mocks.post,
    isAxiosError: vi.fn(() => false),
  },
}));

import { authSessionStore } from '../../features/auth/authSessionStore';
import { refreshAccessToken } from './httpClient';

describe('refreshAccessToken', () => {
  beforeEach(() => {
    authSessionStore.clear();
    document.cookie = 'hh_csrf=csrf-value; path=/';
  });

  it('refreshes with credentials, CSRF and web client platform', async () => {
    mocks.post.mockResolvedValue({ data: { data: { accessToken: 'access-1' } } });
    await expect(refreshAccessToken()).resolves.toBe('access-1');
    expect(authSessionStore.getSnapshot().accessToken).toBe('access-1');
    expect(mocks.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      undefined,
      expect.objectContaining({
        withCredentials: true,
        headers: expect.objectContaining({
          'X-CSRF-Token': 'csrf-value',
          'X-Client-Platform': 'web',
        }),
      }),
    );
  });

  it('does not retain authentication when refresh fails', async () => {
    authSessionStore.setAccessToken('stale-access');
    mocks.post.mockRejectedValue(new Error('network'));
    await expect(refreshAccessToken()).rejects.toThrow('network');
    expect(authSessionStore.getSnapshot().accessToken).toBeNull();
  });
});
