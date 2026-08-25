import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';
import type { OrderStatus } from './order.entity';

@Entity({ name: 'order_status_histories' })
@Index('idx_order_status_order_time', ['tenantId', 'orderId', 'changedAt'])
@Index('idx_order_status_changed_at', ['tenantId', 'changedAt'])
export class OrderStatusHistoryEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'order_id', type: 'bigint', unsigned: true }) orderId!: string;
  @Column({ name: 'from_status', type: 'varchar', length: 32, nullable: true })
  fromStatus!: OrderStatus | null;
  @Column({ name: 'to_status', type: 'varchar', length: 32 }) toStatus!: OrderStatus;
  @Column({ name: 'reason', type: 'varchar', length: 500, nullable: true }) reason!: string | null;
  @Column({ name: 'changed_at', type: 'datetime', precision: 3 }) changedAt!: Date;
  @Column({ name: 'changed_by', type: 'bigint', unsigned: true, nullable: true })
  changedBy!: string | null;
}
