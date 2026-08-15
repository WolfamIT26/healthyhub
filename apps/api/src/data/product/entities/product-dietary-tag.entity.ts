import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

export type ProductDietaryTag =
  | 'low-sugar'
  | 'sugar-free'
  | 'high-protein'
  | 'vegan'
  | 'vegetarian'
  | 'lactose-free'
  | 'gluten-free'
  | 'organic';

@Entity({ name: 'product_dietary_tags' })
@Index('uq_product_dietary_tenant_product_tag', ['tenantId', 'productId', 'dietaryTag'], {
  unique: true,
})
@Index('idx_product_dietary_tag_product', ['tenantId', 'dietaryTag', 'productId'])
export class ProductDietaryTagEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true }) productId!: string;
  @Column({ name: 'dietary_tag', type: 'varchar', length: 32 }) dietaryTag!: ProductDietaryTag;
}
