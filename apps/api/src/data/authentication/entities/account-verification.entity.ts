import { Exclude } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import { UserAccountEntity } from '../../user/entities';

@Entity({ name: 'account_verifications' })
@Index('uq_account_verifications_token_reference', ['tokenReference'], { unique: true })
@Index('idx_account_verifications_user_type_status', [
  'userAccountId',
  'verificationType',
  'verificationStatus',
])
@Index('idx_account_verifications_expires', ['expiresAt'])
export class AccountVerificationEntity extends BaseAuditEntity {
  @Column({ name: 'user_account_id', type: 'bigint', unsigned: true })
  userAccountId!: string;

  @Column({ name: 'verification_type', type: 'varchar', length: 32 })
  verificationType!: 'email';

  @Column({ name: 'verification_status', type: 'varchar', length: 32, default: 'pending' })
  verificationStatus!: 'pending' | 'verified' | 'expired' | 'superseded';

  @Exclude()
  @Column({ name: 'token_reference', type: 'char', length: 64, select: false })
  tokenReference!: string;

  @Column({ name: 'expires_at', type: 'datetime', precision: 3 })
  expiresAt!: Date;

  @Column({ name: 'verified_at', type: 'datetime', precision: 3, nullable: true })
  verifiedAt!: Date | null;

  @ManyToOne(() => UserAccountEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_account_id' })
  userAccount!: UserAccountEntity;
}
