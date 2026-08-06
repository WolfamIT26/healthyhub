import { REQUEST_HEADER } from '@healthyhub/shared-config';
import { createBrowserRequestId } from '@healthyhub/shared-utils';
import axios from 'axios';

import { webEnv } from '../../config/env';
import { normalizeApiError } from './normalizeApiError';

export const httpClient = axios.create({
  baseURL: webEnv.apiBaseUrl,
  headers: {
    'Accept-Language': 'vi-VN',
  },
  timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
  const requestId = createBrowserRequestId();
  config.headers.set(REQUEST_HEADER.requestId, requestId);
  config.headers.set(REQUEST_HEADER.traceId, requestId);
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);
