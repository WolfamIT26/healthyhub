import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'cart_items' })
@Index(
  'uq_cart_items_tenant_cart_product_status',
  ['tenantId', 'cartId', 'productId', 'itemStatus'],
  { unique: true },
)
@Index('idx_cart_items_cart', ['tenantId', 'cartId', 'itemStatus'])
@Index('idx_cart_items_product', ['tenantId', 'productId'])
export class CartItemEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'cart_id', type: 'bigint', unsigned: true }) cartId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true }) productId!: string;
  @Column({ name: 'quantity', type: 'int', unsigned: true, default: 1 }) quantity!: number;
  @Column({ name: 'item_price_snapshot', type: 'decimal', precision: 12, scale: 2, nullable: true })
  itemPriceSnapshot!: null;
  @Column({ name: 'item_status', type: 'varchar', length: 32, default: 'active' }) itemStatus!:
    'active' | 'unavailable' | 'removed';
  @Column({ name: 'added_at', type: 'datetime', precision: 3 }) addedAt!: Date;
}
