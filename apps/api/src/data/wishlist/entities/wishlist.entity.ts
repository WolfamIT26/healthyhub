import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'wishlists' })
@Index('uq_wishlists_tenant_customer_name', ['tenantId', 'customerProfileId', 'wishlistName'], {
  unique: true,
})
@Index('idx_wishlists_customer_status', ['tenantId', 'customerProfileId', 'wishlistStatus'])
export class WishlistEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'customer_profile_id', type: 'bigint', unsigned: true })
  customerProfileId!: string;
  @Column({ name: 'wishlist_name', type: 'varchar', length: 150, default: 'Default' })
  wishlistName!: string;
  @Column({ name: 'wishlist_visibility', type: 'varchar', length: 32, default: 'private' })
  wishlistVisibility!: 'private';
  @Column({ name: 'wishlist_status', type: 'varchar', length: 32, default: 'active' })
  wishlistStatus!: 'active' | 'archived';
}
