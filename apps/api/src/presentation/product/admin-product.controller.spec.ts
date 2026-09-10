import { GUARDS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';

import { REQUIRED_PERMISSIONS, REQUIRED_ROLES } from '../authentication/authentication.decorators';
import {
  AccessTokenGuard,
  PermissionsGuard,
  RolesGuard,
} from '../authentication/authentication.guards';
import { AdminProductController } from './admin-product.controller';

describe('AdminProductController security metadata', () => {
  it('requires current Internal role and read permission at the controller boundary', () => {
    expect(Reflect.getMetadata(GUARDS_METADATA, AdminProductController)).toEqual([
      AccessTokenGuard,
      RolesGuard,
      PermissionsGuard,
    ]);
    expect(Reflect.getMetadata(REQUIRED_ROLES, AdminProductController)).toEqual([
      'STAFF',
      'MANAGER',
      'ADMINISTRATOR',
    ]);
    expect(Reflect.getMetadata(REQUIRED_PERMISSIONS, AdminProductController)).toEqual([
      'products:read',
    ]);
  });

  it.each(['create', 'update', 'updateStatus', 'delete'] as const)(
    'requires products:manage for %s',
    (handler) => {
      expect(
        Reflect.getMetadata(REQUIRED_PERMISSIONS, AdminProductController.prototype[handler]),
      ).toEqual(['products:manage']);
    },
  );
});
