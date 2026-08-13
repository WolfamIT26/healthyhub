import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'orders' })
@Index('uq_orders_tenant_code', ['tenantId', 'orderCode'], { unique: true })
@Index(
  'uq_orders_tenant_customer_idempotency',
  ['tenantId', 'customerProfileId', 'idempotencyKeyHash'],
  { unique: true },
)
@Index('idx_orders_customer_time', ['tenantId', 'customerProfileId', 'placedAt'])
@Index('idx_orders_status_time', ['tenantId', 'orderStatus', 'placedAt'])
export class OrderEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'customer_profile_id', type: 'bigint', unsigned: true })
  customerProfileId!: string;
  @Column({ name: 'cart_id', type: 'bigint', unsigned: true, nullable: true }) cartId!:
    string | null;
  @Column({ name: 'order_code', type: 'varchar', length: 64 }) orderCode!: string;
  @Column({ name: 'order_source', type: 'varchar', length: 32, default: 'web' })
  orderSource!: 'web';
  @Column({ name: 'order_status', type: 'varchar', length: 32, default: 'new' }) orderStatus!:
    'new' | 'confirmed';
  @Column({ name: 'payment_status_snapshot', type: 'varchar', length: 32, default: 'pending' })
  paymentStatusSnapshot!: 'pending' | 'paid' | 'failed' | 'cancelled';
  @Column({ name: 'shipping_status_snapshot', type: 'varchar', length: 32, default: 'pending' })
  shippingStatusSnapshot!: 'pending';
  @Column({ name: 'order_total', type: 'decimal', precision: 12, scale: 2 }) orderTotal!: string;
  @Column({ name: 'idempotency_key_hash', type: 'char', length: 64 }) idempotencyKeyHash!: string;
  @Column({ name: 'request_hash', type: 'char', length: 64 }) requestHash!: string;
  @Column({ name: 'placed_at', type: 'datetime', precision: 3 }) placedAt!: Date;
  @Column({ name: 'completed_at', type: 'datetime', precision: 3, nullable: true })
  completedAt!: Date | null;
}
