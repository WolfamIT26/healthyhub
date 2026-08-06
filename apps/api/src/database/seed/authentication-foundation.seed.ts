import { PERMISSION_NAMES, ROLE_NAMES } from '@healthyhub/shared-types';
import { In, type EntityManager } from 'typeorm';

import { PermissionEntity, RoleEntity, RolePermissionEntity } from '../../data/user/entities';

export const AUTHENTICATION_ROLE_SEED = ROLE_NAMES.map((roleCode) => ({
  roleCode,
  roleName: roleCode.charAt(0) + roleCode.slice(1).toLowerCase(),
  roleScope: 'application' as const,
  roleStatus: 'active' as const,
}));

export const AUTHENTICATION_PERMISSION_SEED = PERMISSION_NAMES.map((permissionCode) => ({
  permissionCode,
  permissionName: permissionCode,
  permissionStatus: 'active' as const,
}));

export async function seedAuthenticationFoundation(manager: EntityManager): Promise<void> {
  const roleRepository = manager.getRepository(RoleEntity);
  const permissionRepository = manager.getRepository(PermissionEntity);
  const rolePermissionRepository = manager.getRepository(RolePermissionEntity);

  await roleRepository.upsert(AUTHENTICATION_ROLE_SEED, ['roleCode']);
  await permissionRepository.upsert(AUTHENTICATION_PERMISSION_SEED, ['permissionCode']);

  const administrator = await roleRepository.findOneByOrFail({ roleCode: 'ADMINISTRATOR' });
  const permissions = await permissionRepository.findBy({ permissionCode: In(PERMISSION_NAMES) });
  const assignedAt = new Date();

  await rolePermissionRepository.upsert(
    permissions.map((permission) => ({
      roleId: administrator.id,
      permissionId: permission.id,
      assignedAt,
      assignmentStatus: 'active' as const,
    })),
    ['roleId', 'permissionId'],
  );
}
