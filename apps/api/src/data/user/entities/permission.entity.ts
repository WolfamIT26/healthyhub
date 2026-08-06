import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import { RolePermissionEntity } from './role-permission.entity';

@Entity({ name: 'permissions' })
@Index('uq_permissions_permission_code', ['permissionCode'], { unique: true })
@Index('idx_permissions_status', ['permissionStatus'])
export class PermissionEntity extends BaseAuditEntity {
  @Column({ name: 'permission_code', type: 'varchar', length: 100 })
  permissionCode!: string;

  @Column({ name: 'permission_name', type: 'varchar', length: 150 })
  permissionName!: string;

  @Column({ name: 'permission_status', type: 'varchar', length: 32, default: 'active' })
  permissionStatus!: 'active' | 'inactive';

  @OneToMany(() => RolePermissionEntity, (assignment) => assignment.permission)
  roleAssignments!: RolePermissionEntity[];
}
