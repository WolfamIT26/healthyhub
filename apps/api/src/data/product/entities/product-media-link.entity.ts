import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'product_media_links' })
@Index(
  'uq_product_media_tenant_product_media_role',
  ['tenantId', 'productId', 'mediaAssetId', 'mediaRole'],
  { unique: true },
)
@Index('idx_product_media_product_role', ['tenantId', 'productId', 'mediaRole', 'displayOrder'])
@Index('idx_product_media_media', ['tenantId', 'mediaAssetId'])
export class ProductMediaLinkEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true }) productId!: string;
  @Column({ name: 'media_asset_id', type: 'bigint', unsigned: true }) mediaAssetId!: string;
  @Column({ name: 'media_role', type: 'varchar', length: 64, default: 'gallery' }) mediaRole!:
    'main' | 'gallery' | 'nutrition';
  @Column({ name: 'display_order', type: 'int', unsigned: true, default: 0 })
  displayOrder!: number;
  @Column({ name: 'link_status', type: 'varchar', length: 32, default: 'active' }) linkStatus!:
    'active' | 'inactive';
}
