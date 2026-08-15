import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'categories' })
@Index('uq_categories_tenant_slug', ['tenantId', 'slug'], { unique: true })
@Index('idx_categories_parent', ['tenantId', 'parentCategoryId'])
@Index('idx_categories_visibility_status', ['tenantId', 'categoryVisibility', 'categoryStatus'])
export class CategoryEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'category_name', type: 'varchar', length: 255 }) categoryName!: string;
  @Column({ type: 'varchar', length: 191 }) slug!: string;
  @Column({ type: 'varchar', length: 500, nullable: true }) description!: string | null;
  @Column({ name: 'parent_category_id', type: 'bigint', unsigned: true, nullable: true })
  parentCategoryId!: string | null;
  @Column({ name: 'category_status', type: 'varchar', length: 32, default: 'active' })
  categoryStatus!: 'active' | 'hidden' | 'archived';
  @Column({ name: 'category_visibility', type: 'varchar', length: 32, default: 'public' })
  categoryVisibility!: 'public' | 'private';
}
