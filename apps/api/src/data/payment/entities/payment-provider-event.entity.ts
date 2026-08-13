import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import type { WebhookProcessingStatus } from '../../../domain/payment/payment-webhook.contract';

@Entity({ name: 'payment_provider_events' })
@Index('uq_payment_provider_events_identity', ['tenantId', 'provider', 'providerEventId'], {
  unique: true,
})
@Index('idx_payment_provider_events_payment_time', ['tenantId', 'paymentId', 'receivedAt'])
@Index('idx_payment_provider_events_status_time', ['tenantId', 'processingStatus', 'receivedAt'])
export class PaymentProviderEventEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'provider', type: 'varchar', length: 32 }) provider!: string;
  @Column({ name: 'provider_event_id', type: 'varchar', length: 191 }) providerEventId!: string;
  @Column({ name: 'event_type', type: 'varchar', length: 100 }) eventType!: string;
  @Column({ name: 'payment_id', type: 'bigint', unsigned: true, nullable: true }) paymentId!:
    string | null;
  @Column({ name: 'provider_reference', type: 'varchar', length: 191 }) providerReference!: string;
  @Column({ name: 'payload_hash', type: 'char', length: 64 }) payloadHash!: string;
  @Column({ name: 'processing_status', type: 'varchar', length: 32, default: 'received' })
  processingStatus!: WebhookProcessingStatus;
  @Column({ name: 'received_at', type: 'datetime', precision: 3 }) receivedAt!: Date;
  @Column({ name: 'processing_started_at', type: 'datetime', precision: 3, nullable: true })
  processingStartedAt!: Date | null;
  @Column({ name: 'processed_at', type: 'datetime', precision: 3, nullable: true })
  processedAt!: Date | null;
  @Column({ name: 'failure_code', type: 'varchar', length: 100, nullable: true }) failureCode!:
    string | null;
}
