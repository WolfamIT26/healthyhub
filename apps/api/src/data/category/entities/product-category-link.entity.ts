import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'product_category_links' })
@Index('uq_product_category_tenant_product_category', ['tenantId', 'productId', 'categoryId'], {
  unique: true,
})
@Index('idx_product_category_product', ['tenantId', 'productId', 'linkStatus'])
@Index('idx_product_category_category', ['tenantId', 'categoryId', 'linkStatus'])
export class ProductCategoryLinkEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true }) productId!: string;
  @Column({ name: 'category_id', type: 'bigint', unsigned: true }) categoryId!: string;
  @Column({ name: 'is_primary', type: 'boolean', default: false }) isPrimary!: boolean;
  @Column({ name: 'link_status', type: 'varchar', length: 32, default: 'active' }) linkStatus!:
    'active' | 'inactive';
  @Column({ name: 'linked_at', type: 'datetime', precision: 3 }) linkedAt!: Date;
}
