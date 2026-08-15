import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'product_contents' })
@Index('uq_product_contents_tenant_product_status', ['tenantId', 'productId', 'contentStatus'], {
  unique: true,
})
@Index('idx_product_contents_product_status', ['tenantId', 'productId', 'contentStatus'])
export class ProductContentEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true }) productId!: string;
  @Column({ type: 'text' }) description!: string;
  @Column({ type: 'varchar', length: 500, nullable: true }) summary!: string | null;
  @Column({ name: 'usage_note', type: 'text', nullable: true }) usageNote!: string | null;
  @Column({ name: 'storage_note', type: 'text', nullable: true }) storageNote!: string | null;
  @Column({ name: 'seo_title', type: 'varchar', length: 255, nullable: true }) seoTitle!:
    string | null;
  @Column({ name: 'seo_description', type: 'varchar', length: 500, nullable: true })
  seoDescription!: string | null;
  @Column({ name: 'content_status', type: 'varchar', length: 32, default: 'draft' })
  contentStatus!: 'draft' | 'review' | 'published';
}
