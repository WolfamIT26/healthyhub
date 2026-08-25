import type { AdminDashboardResult } from '@healthyhub/shared-types';
import { Inject, Injectable } from '@nestjs/common';

import {
  ADMIN_DASHBOARD_REPOSITORY,
  type AdminDashboardRepository,
} from '../../data/admin/repositories';

const HEALTHYHUB_V1_TENANT_ID = '1';

@Injectable()
export class AdminDashboardService {
  constructor(
    @Inject(ADMIN_DASHBOARD_REPOSITORY)
    private readonly repository: AdminDashboardRepository,
  ) {}

  async getDashboard(): Promise<AdminDashboardResult> {
    const metrics = await this.repository.readMetrics(HEALTHYHUB_V1_TENANT_ID);
    return { ...metrics, generatedAt: new Date().toISOString() };
  }
}
