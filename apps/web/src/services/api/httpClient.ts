import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { webEnv } from '../../config/env';
import { normalizeApiError } from './normalizeApiError';
import { authSessionStore } from '../../features/auth/authSessionStore';

const CSRF_COOKIE = 'hh_csrf';
const REQUEST_ID_HEADER = 'X-Request-Id';
const TRACE_ID_HEADER = 'X-Trace-Id';
let refreshPromise: Promise<string> | null = null;

export const httpClient = axios.create({
  baseURL: webEnv.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Accept-Language': 'vi-VN', 'X-Client-Platform': 'web' },
});

httpClient.interceptors.request.use((config) => {
  const requestId = createBrowserRequestId();
  config.headers.set(REQUEST_ID_HEADER, requestId);
  config.headers.set(TRACE_ID_HEADER, requestId);
  const accessToken = authSessionStore.getSnapshot().accessToken;
  if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`);
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && shouldRefresh(error)) {
      const config = error.config as RetriableRequestConfig;
      config._authRetry = true;
      try {
        const accessToken = await refreshAccessToken();
        config.headers.set('Authorization', `Bearer ${accessToken}`);
        return await httpClient.request(config);
      } catch (refreshError) {
        authSessionStore.clear();
        return Promise.reject(normalizeApiError(refreshError));
      }
    }
    return Promise.reject(normalizeApiError(error));
  },
);

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _authRetry?: boolean;
}

function createBrowserRequestId(): string {
  const randomValue =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `req_${randomValue}`;
}

function shouldRefresh(error: AxiosError): boolean {
  const config = error.config as RetriableRequestConfig | undefined;
  const url = config?.url ?? '';
  const protectedRequest =
    !url.includes('/auth/') || url.includes('/auth/session') || url.includes('/auth/logout');
  return error.response?.status === 401 && !config?._authRetry && protectedRequest;
}

export function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;
  const csrfToken = readCookie(CSRF_COOKIE);
  refreshPromise = axios
    .post(`${webEnv.apiBaseUrl}/auth/refresh`, undefined, {
      withCredentials: true,
      timeout: 15000,
      headers: {
        'Accept-Language': 'vi-VN',
        'X-Client-Platform': 'web',
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      },
    })
    .then((response) => {
      const accessToken = response.data?.data?.accessToken;
      if (typeof accessToken !== 'string') throw new Error('Refresh response không hợp lệ.');
      authSessionStore.setAccessToken(accessToken);
      return accessToken;
    })
    .catch((error: unknown) => {
      authSessionStore.clear();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const prefix = `${encodeURIComponent(name)}=`;
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);
}
