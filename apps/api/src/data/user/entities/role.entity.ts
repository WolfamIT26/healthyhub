import type { RoleName } from '@healthyhub/shared-types';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import { RolePermissionEntity } from './role-permission.entity';
import { UserRoleAssignmentEntity } from './user-role-assignment.entity';

@Entity({ name: 'roles' })
@Index('uq_roles_role_code', ['roleCode'], { unique: true })
@Index('idx_roles_status', ['roleStatus'])
export class RoleEntity extends BaseAuditEntity {
  @Column({ name: 'role_code', type: 'varchar', length: 64 })
  roleCode!: RoleName;

  @Column({ name: 'role_name', type: 'varchar', length: 150 })
  roleName!: string;

  @Column({ name: 'role_scope', type: 'varchar', length: 64, default: 'application' })
  roleScope!: 'application';

  @Column({ name: 'role_status', type: 'varchar', length: 32, default: 'active' })
  roleStatus!: 'active' | 'inactive';

  @OneToMany(() => RolePermissionEntity, (assignment) => assignment.role)
  permissionAssignments!: RolePermissionEntity[];

  @OneToMany(() => UserRoleAssignmentEntity, (assignment) => assignment.role)
  userAssignments!: UserRoleAssignmentEntity[];
}
