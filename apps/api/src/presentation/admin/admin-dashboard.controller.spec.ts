import { GUARDS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';

import { REQUIRED_PERMISSIONS, REQUIRED_ROLES } from '../authentication/authentication.decorators';
import {
  AccessTokenGuard,
  PermissionsGuard,
  RolesGuard,
} from '../authentication/authentication.guards';
import { AdminDashboardController } from './admin-dashboard.controller';

describe('AdminDashboardController security boundary', () => {
  it('requires bearer authentication, an Internal role and analytics permission', () => {
    expect(Reflect.getMetadata(GUARDS_METADATA, AdminDashboardController)).toEqual([
      AccessTokenGuard,
      RolesGuard,
      PermissionsGuard,
    ]);
    expect(Reflect.getMetadata(REQUIRED_ROLES, AdminDashboardController)).toEqual([
      'STAFF',
      'MANAGER',
      'ADMINISTRATOR',
    ]);
    expect(Reflect.getMetadata(REQUIRED_PERMISSIONS, AdminDashboardController)).toEqual([
      'analytics:read',
    ]);
  });

  it('delegates the read-only endpoint without accepting client authority input', async () => {
    const result = { generatedAt: '2026-08-25T00:00:00.000Z' };
    const dashboard = { getDashboard: () => Promise.resolve(result) };
    const controller = new AdminDashboardController(dashboard as never);

    await expect(controller.getDashboard()).resolves.toBe(result);
  });
});
