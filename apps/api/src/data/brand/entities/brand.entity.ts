import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'brands' })
@Index('uq_brands_tenant_slug', ['tenantId', 'brandSlug'], { unique: true })
@Index('uq_brands_tenant_name', ['tenantId', 'brandName'], { unique: true })
@Index('idx_brands_status', ['tenantId', 'brandStatus'])
export class BrandEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'brand_name', type: 'varchar', length: 255 }) brandName!: string;
  @Column({ name: 'brand_slug', type: 'varchar', length: 191 }) brandSlug!: string;
  @Column({ name: 'brand_origin', type: 'varchar', length: 150, nullable: true }) brandOrigin!:
    string | null;
  @Column({ name: 'brand_status', type: 'varchar', length: 32, default: 'active' })
  brandStatus!: 'active' | 'hidden' | 'archived';
  @Column({ type: 'text', nullable: true }) description!: string | null;
}
