import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

export type StockReservationStatus = 'active' | 'consumed' | 'released' | 'restocked';

@Entity({ name: 'stock_reservations' })
@Index('uq_stock_reservations_tenant_order_item', ['tenantId', 'orderId', 'inventoryItemId'], {
  unique: true,
})
@Index('idx_stock_reservations_item_status', ['tenantId', 'inventoryItemId', 'reservationStatus'])
@Index('idx_stock_reservations_order_status', ['tenantId', 'orderId', 'reservationStatus'])
export class StockReservationEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'inventory_item_id', type: 'bigint', unsigned: true })
  inventoryItemId!: string;
  @Column({ name: 'order_id', type: 'bigint', unsigned: true }) orderId!: string;
  @Column({ name: 'reserved_quantity', type: 'int', unsigned: true }) reservedQuantity!: number;
  @Column({ name: 'reservation_status', type: 'varchar', length: 32, default: 'active' })
  reservationStatus!: StockReservationStatus;
  @Column({ name: 'reserved_at', type: 'datetime', precision: 3 }) reservedAt!: Date;
  @Column({ name: 'consumed_at', type: 'datetime', precision: 3, nullable: true })
  consumedAt!: Date | null;
  @Column({ name: 'released_at', type: 'datetime', precision: 3, nullable: true })
  releasedAt!: Date | null;
  @Column({ name: 'reacquired_at', type: 'datetime', precision: 3, nullable: true })
  reacquiredAt!: Date | null;
  @Column({ name: 'restocked_at', type: 'datetime', precision: 3, nullable: true })
  restockedAt!: Date | null;
}
