import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import type { ShipmentStatus } from './shipment.entity';

@Entity({ name: 'shipping_status_histories' })
@Index('idx_shipping_status_shipment_time', ['tenantId', 'shipmentId', 'changedAt'])
export class ShippingStatusHistoryEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'shipment_id', type: 'bigint', unsigned: true }) shipmentId!: string;
  @Column({ name: 'from_status', type: 'varchar', length: 32, nullable: true })
  fromStatus!: ShipmentStatus | null;
  @Column({ name: 'to_status', type: 'varchar', length: 32 }) toStatus!: ShipmentStatus;
  @Column({ name: 'reason', type: 'varchar', length: 500, nullable: true }) reason!: string | null;
  @Column({ name: 'changed_at', type: 'datetime', precision: 3 }) changedAt!: Date;
  @Column({ name: 'changed_by', type: 'bigint', unsigned: true, nullable: true })
  changedBy!: string | null;
}
