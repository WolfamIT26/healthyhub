import type { AdminDashboardMetrics } from '@healthyhub/shared-types';

export interface AdminDashboardRepository {
  readMetrics(tenantId: string): Promise<AdminDashboardMetrics>;
}

export const ADMIN_DASHBOARD_REPOSITORY = Symbol('ADMIN_DASHBOARD_REPOSITORY');
