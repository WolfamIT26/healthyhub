import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'role_permissions' })
@Index('uq_role_permissions_role_permission', ['roleId', 'permissionId'], { unique: true })
@Index('idx_role_permissions_permission', ['permissionId'])
export class RolePermissionEntity extends BaseAuditEntity {
  @Column({ name: 'role_id', type: 'bigint', unsigned: true })
  roleId!: string;

  @Column({ name: 'permission_id', type: 'bigint', unsigned: true })
  permissionId!: string;

  @Column({ name: 'assigned_at', type: 'datetime', precision: 3 })
  assignedAt!: Date;

  @Column({ name: 'assignment_status', type: 'varchar', length: 32, default: 'active' })
  assignmentStatus!: 'active' | 'revoked';

  @ManyToOne(() => RoleEntity, (role) => role.permissionAssignments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.roleAssignments, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'permission_id' })
  permission!: PermissionEntity;
}
