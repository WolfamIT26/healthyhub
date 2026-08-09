import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'order_items' })
@Index('idx_order_items_order', ['tenantId', 'orderId'])
@Index('idx_order_items_product', ['tenantId', 'productId'])
export class OrderItemEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'order_id', type: 'bigint', unsigned: true }) orderId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true, nullable: true }) productId!: string | null;
  @Column({ name: 'product_name_snapshot', type: 'varchar', length: 255 }) productNameSnapshot!: string;
  @Column({ name: 'sku_snapshot', type: 'varchar', length: 64, nullable: true }) skuSnapshot!: string | null;
  @Column({ name: 'unit_price_snapshot', type: 'decimal', precision: 12, scale: 2 }) unitPriceSnapshot!: string;
  @Column({ name: 'quantity', type: 'int', unsigned: true }) quantity!: number;
  @Column({ name: 'line_total', type: 'decimal', precision: 12, scale: 2 }) lineTotal!: string;
  @Column({ name: 'item_status', type: 'varchar', length: 32, default: 'active' }) itemStatus!: 'active';
}
