import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'products' })
@Index('uq_products_tenant_code', ['tenantId', 'productCode'], { unique: true })
@Index('uq_products_tenant_slug', ['tenantId', 'slug'], { unique: true })
@Index('idx_products_tenant_status_visibility', ['tenantId', 'productStatus', 'productVisibility'])
export class ProductEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'brand_id', type: 'bigint', unsigned: true, nullable: true }) brandId!:
    string | null;
  @Column({ name: 'product_code', type: 'varchar', length: 64 }) productCode!: string;
  @Column({ name: 'product_name', type: 'varchar', length: 255 }) productName!: string;
  @Column({ name: 'slug', type: 'varchar', length: 191 }) slug!: string;
  @Column({ name: 'base_price', type: 'decimal', precision: 12, scale: 2, default: '0.00' })
  basePrice!: string;
  @Column({ name: 'sellable_status', type: 'varchar', length: 32, default: 'unavailable' })
  sellableStatus!: 'sellable' | 'out_of_stock' | 'preorder' | 'unavailable';
  @Column({ name: 'product_visibility', type: 'varchar', length: 32, default: 'hidden' })
  productVisibility!: 'public' | 'hidden' | 'private';
  @Column({ name: 'product_status', type: 'varchar', length: 32, default: 'draft' })
  productStatus!: 'draft' | 'active' | 'discontinued';
}
