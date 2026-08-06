import { Exclude } from 'class-transformer';
import type { AccountStatus } from '@healthyhub/shared-types';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import { UserRoleAssignmentEntity } from './user-role-assignment.entity';

@Entity({ name: 'user_accounts' })
@Index('uq_user_accounts_normalized_email', ['normalizedEmail'], { unique: true })
@Index('idx_user_accounts_status', ['userStatus'])
@Index('idx_user_accounts_last_login', ['lastLoginAt'])
export class UserAccountEntity extends BaseAuditEntity {
  @Column({ name: 'email', type: 'varchar', length: 254 })
  email!: string;

  @Column({ name: 'normalized_email', type: 'varchar', length: 254 })
  normalizedEmail!: string;

  @Column({ name: 'phone', type: 'varchar', length: 32, nullable: true })
  phone!: string | null;

  @Column({ name: 'display_name', type: 'varchar', length: 255 })
  displayName!: string;

  @Exclude()
  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Column({ name: 'user_status', type: 'varchar', length: 32, default: 'pending' })
  userStatus!: AccountStatus;

  @Column({ name: 'email_verified_at', type: 'datetime', precision: 3, nullable: true })
  emailVerifiedAt!: Date | null;

  @Column({ name: 'locked_until', type: 'datetime', precision: 3, nullable: true })
  lockedUntil!: Date | null;

  @Column({ name: 'last_login_at', type: 'datetime', precision: 3, nullable: true })
  lastLoginAt!: Date | null;

  @Column({ name: 'permissions_version', type: 'int', unsigned: true, default: 1 })
  permissionsVersion!: number;

  @OneToMany(() => UserRoleAssignmentEntity, (assignment) => assignment.userAccount)
  roleAssignments!: UserRoleAssignmentEntity[];
}
