import { Exclude } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import { UserAccountEntity } from '../../user/entities';

@Entity({ name: 'login_attempts' })
@Index('idx_login_attempts_identifier_time', ['identifierHash', 'attemptedAt'])
@Index('idx_login_attempts_ip_time', ['ipHash', 'attemptedAt'])
export class LoginAttemptEntity extends BaseAuditEntity {
  @Column({ name: 'user_account_id', type: 'bigint', unsigned: true, nullable: true })
  userAccountId!: string | null;

  @Exclude()
  @Column({ name: 'identifier_hash', type: 'char', length: 64, select: false })
  identifierHash!: string;

  @Column({ name: 'attempt_status', type: 'varchar', length: 32, default: 'failed' })
  attemptStatus!: 'success' | 'failed' | 'blocked';

  @Column({ name: 'failure_reason', type: 'varchar', length: 64, nullable: true })
  failureReason!: string | null;

  @Exclude()
  @Column({ name: 'ip_hash', type: 'char', length: 64, nullable: true, select: false })
  ipHash!: string | null;

  @Column({ name: 'user_agent_family', type: 'varchar', length: 100, nullable: true })
  userAgentFamily!: string | null;

  @Column({ name: 'attempted_at', type: 'datetime', precision: 3 })
  attemptedAt!: Date;

  @ManyToOne(() => UserAccountEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_account_id' })
  userAccount!: UserAccountEntity | null;
}
