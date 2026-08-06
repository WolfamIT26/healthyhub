import { describe, expect, it, vi } from 'vitest';

import type { EntityManager } from 'typeorm';

import {
  AUTHENTICATION_PERMISSION_SEED,
  AUTHENTICATION_ROLE_SEED,
  seedAuthenticationFoundation,
} from './authentication-foundation.seed';

describe('Authentication foundation seed', () => {
  it('contains only approved V1 roles and permissions', () => {
    expect(AUTHENTICATION_ROLE_SEED.map((role) => role.roleCode)).toEqual([
      'CUSTOMER',
      'STAFF',
      'MANAGER',
      'ADMINISTRATOR',
    ]);
    expect(AUTHENTICATION_PERMISSION_SEED.map((permission) => permission.permissionCode)).toEqual([
      'users:manage',
      'sessions:manage',
    ]);
  });

  it('uses conflict-safe upserts and creates no account', async () => {
    const roleRepository = {
      upsert: vi.fn().mockResolvedValue(undefined),
      findOneByOrFail: vi.fn().mockResolvedValue({ id: '4', roleCode: 'ADMINISTRATOR' }),
    };
    const permissionRepository = {
      upsert: vi.fn().mockResolvedValue(undefined),
      findBy: vi.fn().mockResolvedValue([
        { id: '1', permissionCode: 'users:manage' },
        { id: '2', permissionCode: 'sessions:manage' },
      ]),
    };
    const rolePermissionRepository = { upsert: vi.fn().mockResolvedValue(undefined) };
    const repositories = [roleRepository, permissionRepository, rolePermissionRepository];
    const manager = {
      getRepository: vi.fn().mockImplementation(() => repositories.shift()),
    } as unknown as EntityManager;

    await seedAuthenticationFoundation(manager);

    expect(roleRepository.upsert).toHaveBeenCalledTimes(1);
    expect(permissionRepository.upsert).toHaveBeenCalledTimes(1);
    expect(rolePermissionRepository.upsert).toHaveBeenCalledTimes(1);
    expect(manager.getRepository).toHaveBeenCalledTimes(3);
  });
});
