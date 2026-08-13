import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'wishlist_items' })
@Index(
  'uq_wishlist_items_tenant_wishlist_product_status',
  ['tenantId', 'wishlistId', 'productId', 'wishlistItemStatus'],
  { unique: true },
)
@Index('idx_wishlist_items_wishlist', ['tenantId', 'wishlistId', 'wishlistItemStatus', 'savedAt'])
@Index('idx_wishlist_items_product', ['tenantId', 'productId'])
export class WishlistItemEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'wishlist_id', type: 'bigint', unsigned: true }) wishlistId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true }) productId!: string;
  @Column({ name: 'saved_at', type: 'datetime', precision: 3 }) savedAt!: Date;
  @Column({ name: 'wishlist_item_status', type: 'varchar', length: 32, default: 'active' })
  wishlistItemStatus!: 'active' | 'removed' | 'unavailable';
  @Column({ name: 'note', type: 'varchar', length: 500, nullable: true }) note!: string | null;
}
