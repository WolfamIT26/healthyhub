import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import { RoleEntity } from './role.entity';
import { UserAccountEntity } from './user-account.entity';

@Entity({ name: 'user_role_assignments' })
@Index('uq_user_roles_user_role', ['userAccountId', 'roleId'], { unique: true })
@Index('idx_user_roles_user_status', ['userAccountId', 'assignmentStatus'])
export class UserRoleAssignmentEntity extends BaseAuditEntity {
  @Column({ name: 'user_account_id', type: 'bigint', unsigned: true })
  userAccountId!: string;

  @Column({ name: 'role_id', type: 'bigint', unsigned: true })
  roleId!: string;

  @Column({ name: 'assigned_at', type: 'datetime', precision: 3 })
  assignedAt!: Date;

  @Column({ name: 'expires_at', type: 'datetime', precision: 3, nullable: true })
  expiresAt!: Date | null;

  @Column({ name: 'assignment_status', type: 'varchar', length: 32, default: 'active' })
  assignmentStatus!: 'active' | 'expired' | 'revoked';

  @ManyToOne(() => UserAccountEntity, (user) => user.roleAssignments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_account_id' })
  userAccount!: UserAccountEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userAssignments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;
}
