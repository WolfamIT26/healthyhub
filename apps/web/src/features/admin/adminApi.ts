import type { AdminDashboardResponse } from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';

export const adminApi = {
  dashboard: (signal?: AbortSignal) =>
    httpClient
      .get<AdminDashboardResponse>('/admin/analytics/dashboard', { signal })
      .then((response) => response.data.data),
};
