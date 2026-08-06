import { Exclude } from 'class-transformer';
import type { SessionStatus } from '@healthyhub/shared-types';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import { UserAccountEntity } from '../../user/entities';

export interface SessionContext {
  deviceLabel?: string;
  platform?: string;
  browserFamily?: string;
}

@Entity({ name: 'authentication_sessions' })
@Index('uq_auth_sessions_public_id', ['sessionPublicId'], { unique: true })
@Index('uq_auth_sessions_refresh_hash', ['refreshTokenHash'], { unique: true })
@Index('idx_auth_sessions_user_status', ['userAccountId', 'sessionStatus'])
@Index('idx_auth_sessions_expires', ['expiresAt'])
@Index('idx_auth_sessions_family_status', ['refreshTokenFamilyId', 'sessionStatus'])
export class AuthenticationSessionEntity extends BaseAuditEntity {
  @Column({ name: 'user_account_id', type: 'bigint', unsigned: true })
  userAccountId!: string;

  @Column({ name: 'session_public_id', type: 'char', length: 36 })
  sessionPublicId!: string;

  @Column({ name: 'session_status', type: 'varchar', length: 32, default: 'active' })
  sessionStatus!: SessionStatus;

  @Exclude()
  @Column({ name: 'refresh_token_hash', type: 'char', length: 64, select: false })
  refreshTokenHash!: string;

  @Column({ name: 'refresh_token_family_id', type: 'char', length: 36 })
  refreshTokenFamilyId!: string;

  @Column({ name: 'refresh_token_generation', type: 'int', unsigned: true, default: 1 })
  refreshTokenGeneration!: number;

  @Column({ name: 'session_context', type: 'json', nullable: true })
  sessionContext!: SessionContext | null;

  @Column({ name: 'issued_at', type: 'datetime', precision: 3 })
  issuedAt!: Date;

  @Column({ name: 'last_used_at', type: 'datetime', precision: 3 })
  lastUsedAt!: Date;

  @Column({ name: 'expires_at', type: 'datetime', precision: 3 })
  expiresAt!: Date;

  @Column({ name: 'revoked_at', type: 'datetime', precision: 3, nullable: true })
  revokedAt!: Date | null;

  @Column({ name: 'compromised_at', type: 'datetime', precision: 3, nullable: true })
  compromisedAt!: Date | null;

  @Column({ name: 'revoked_reason', type: 'varchar', length: 64, nullable: true })
  revokedReason!: string | null;

  @ManyToOne(() => UserAccountEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_account_id' })
  userAccount!: UserAccountEntity;
}
