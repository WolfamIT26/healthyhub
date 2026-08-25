import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { InternalRoles, Permissions } from '../authentication/authentication.decorators';
import {
  AccessTokenGuard,
  PermissionsGuard,
  RolesGuard,
} from '../authentication/authentication.guards';
import { AdminDashboardService } from './admin-dashboard.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard, PermissionsGuard)
@InternalRoles()
@Permissions('analytics:read')
@Controller('admin/analytics')
export class AdminDashboardController {
  constructor(private readonly dashboard: AdminDashboardService) {}

  @Get('dashboard')
  @ApiOperation({ operationId: 'getAdminAnalyticsDashboard' })
  getDashboard() {
    return this.dashboard.getDashboard();
  }
}
