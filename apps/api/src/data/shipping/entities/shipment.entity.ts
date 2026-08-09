import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'shipments' })
@Index('uq_shipments_tenant_order', ['tenantId', 'orderId'], { unique: true })
@Index('idx_shipments_status_time', ['tenantId', 'shippingStatus', 'createdAt'])
export class ShipmentEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'order_id', type: 'bigint', unsigned: true }) orderId!: string;
  @Column({ name: 'shipping_method', type: 'varchar', length: 64, default: 'manual' }) shippingMethod!: 'manual';
  @Column({ name: 'shipping_fee', type: 'decimal', precision: 12, scale: 2, default: '0.00' }) shippingFee!: '0.00';
  @Column({ name: 'shipping_status', type: 'varchar', length: 32, default: 'pending' }) shippingStatus!: 'pending';
  @Column({ name: 'tracking_reference', type: 'varchar', length: 191, nullable: true }) trackingReference!: null;
  @Column({ name: 'shipped_at', type: 'datetime', precision: 3, nullable: true }) shippedAt!: null;
  @Column({ name: 'delivered_at', type: 'datetime', precision: 3, nullable: true }) deliveredAt!: null;
}
