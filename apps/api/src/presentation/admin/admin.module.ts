import { Module } from '@nestjs/common';

import {
  ADMIN_DASHBOARD_REPOSITORY,
  TypeOrmAdminDashboardRepository,
} from '../../data/admin/repositories';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';

@Module({
  imports: [AuthenticationModule],
  controllers: [AdminDashboardController],
  providers: [
    AdminDashboardService,
    { provide: ADMIN_DASHBOARD_REPOSITORY, useClass: TypeOrmAdminDashboardRepository },
  ],
})
export class AdminModule {}
