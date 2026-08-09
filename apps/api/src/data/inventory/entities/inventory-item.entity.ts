import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'inventory_items' })
@Index('uq_inventory_items_tenant_product', ['tenantId', 'productId'], { unique: true })
@Index('idx_inventory_status', ['tenantId', 'stockStatus'])
export class InventoryItemEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true }) productId!: string;
  @Column({ name: 'available_quantity', type: 'int', unsigned: true, default: 0 }) availableQuantity!: number;
  @Column({ name: 'reserved_quantity', type: 'int', unsigned: true, default: 0 }) reservedQuantity!: number;
  @Column({ name: 'stock_threshold', type: 'int', unsigned: true, default: 0 }) stockThreshold!: number;
  @Column({ name: 'stock_status', type: 'varchar', length: 32, default: 'available' }) stockStatus!: 'available' | 'low_stock' | 'out_of_stock' | 'disabled';
}
