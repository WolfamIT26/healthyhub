import {
  INTERNAL_ROLE_NAMES,
  PERMISSION_NAMES,
  ROLE_NAMES,
  type PermissionName,
  type RoleName,
} from '@healthyhub/shared-types';
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

  const internalRoles = await roleRepository.findBy({ roleCode: In(INTERNAL_ROLE_NAMES) });
  const permissions = await permissionRepository.findBy({ permissionCode: In(PERMISSION_NAMES) });
  const assignedAt = new Date();
  const roleByCode = new Map(internalRoles.map((role) => [role.roleCode, role]));
  const permissionByCode = new Map(
    permissions.map((permission) => [permission.permissionCode as PermissionName, permission]),
  );
  const assignments: Array<{ roleCode: RoleName; permissionCode: PermissionName }> = [
    { roleCode: 'STAFF', permissionCode: 'analytics:read' },
    { roleCode: 'MANAGER', permissionCode: 'analytics:read' },
    { roleCode: 'ADMINISTRATOR', permissionCode: 'analytics:read' },
    { roleCode: 'ADMINISTRATOR', permissionCode: 'users:manage' },
    { roleCode: 'ADMINISTRATOR', permissionCode: 'sessions:manage' },
  ];

  await rolePermissionRepository.upsert(
    assignments.map(({ roleCode, permissionCode }) => ({
      roleId: roleByCode.get(roleCode)!.id,
      permissionId: permissionByCode.get(permissionCode)!.id,
      assignedAt,
      assignmentStatus: 'active' as const,
    })),
    ['roleId', 'permissionId'],
  );
}
