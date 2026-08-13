import { Column, Entity, Index } from 'typeorm';
import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'payment_attempts' })
@Index('uq_payment_attempts_provider_reference', ['tenantId', 'provider', 'providerReference'], { unique: true })
@Index('uq_payment_attempts_idempotency', ['tenantId', 'paymentId', 'idempotencyKeyHash'], { unique: true })
@Index('idx_payment_attempts_payment_time', ['tenantId', 'paymentId', 'createdAt'])
export class PaymentAttemptEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'payment_id', type: 'bigint', unsigned: true }) paymentId!: string;
  @Column({ name: 'provider', type: 'varchar', length: 32 }) provider!: 'vnpay';
  @Column({ name: 'provider_reference', type: 'varchar', length: 100 }) providerReference!: string;
  @Column({ name: 'provider_transaction_no', type: 'varchar', length: 32, nullable: true }) providerTransactionNo!: string | null;
  @Column({ name: 'amount', type: 'decimal', precision: 12, scale: 2 }) amount!: string;
  @Column({ name: 'currency', type: 'char', length: 3, default: 'VND' }) currency!: 'VND';
  @Column({ name: 'attempt_status', type: 'varchar', length: 32, default: 'pending' }) attemptStatus!: 'pending' | 'paid' | 'failed' | 'cancelled';
  @Column({ name: 'idempotency_key_hash', type: 'char', length: 64 }) idempotencyKeyHash!: string;
  @Column({ name: 'expires_at', type: 'datetime', precision: 3 }) expiresAt!: Date;
  @Column({ name: 'completed_at', type: 'datetime', precision: 3, nullable: true }) completedAt!: Date | null;
}
