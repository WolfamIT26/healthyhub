import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'payments' })
@Index('uq_payments_tenant_order', ['tenantId', 'orderId'], { unique: true })
@Index('idx_payments_status_time', ['tenantId', 'paymentStatus', 'createdAt'])
export class PaymentEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'order_id', type: 'bigint', unsigned: true }) orderId!: string;
  @Column({ name: 'payment_method', type: 'varchar', length: 64, default: 'cod' }) paymentMethod!: 'cod';
  @Column({ name: 'payment_amount', type: 'decimal', precision: 12, scale: 2 }) paymentAmount!: string;
  @Column({ name: 'payment_status', type: 'varchar', length: 32, default: 'pending' }) paymentStatus!: 'pending';
  @Column({ name: 'paid_at', type: 'datetime', precision: 3, nullable: true }) paidAt!: null;
  @Column({ name: 'provider_reference', type: 'varchar', length: 191, nullable: true }) providerReference!: null;
}
