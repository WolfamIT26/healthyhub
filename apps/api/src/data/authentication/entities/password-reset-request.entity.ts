import { Exclude } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import { UserAccountEntity } from '../../user/entities';

@Entity({ name: 'password_reset_requests' })
@Index('uq_password_reset_token_reference', ['tokenReference'], { unique: true })
@Index('idx_password_reset_user_status', ['userAccountId', 'requestStatus'])
@Index('idx_password_reset_expires', ['expiresAt'])
export class PasswordResetRequestEntity extends BaseAuditEntity {
  @Column({ name: 'user_account_id', type: 'bigint', unsigned: true })
  userAccountId!: string;

  @Column({ name: 'request_status', type: 'varchar', length: 32, default: 'requested' })
  requestStatus!: 'requested' | 'used' | 'expired' | 'cancelled';

  @Exclude()
  @Column({ name: 'token_reference', type: 'char', length: 64, select: false })
  tokenReference!: string;

  @Column({ name: 'requested_at', type: 'datetime', precision: 3 })
  requestedAt!: Date;

  @Column({ name: 'expires_at', type: 'datetime', precision: 3 })
  expiresAt!: Date;

  @Column({ name: 'used_at', type: 'datetime', precision: 3, nullable: true })
  usedAt!: Date | null;

  @ManyToOne(() => UserAccountEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_account_id' })
  userAccount!: UserAccountEntity;
}
