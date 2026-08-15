import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'product_ingredients' })
@Index('uq_product_ingredients_tenant_product_name', ['tenantId', 'productId', 'ingredientName'], {
  unique: true,
})
@Index('idx_product_ingredients_product_order', ['tenantId', 'productId', 'displayOrder'])
export class ProductIngredientEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true }) productId!: string;
  @Column({ name: 'ingredient_name', type: 'varchar', length: 255 }) ingredientName!: string;
  @Column({ name: 'ingredient_description', type: 'text', nullable: true })
  ingredientDescription!: string | null;
  @Column({ name: 'nutrition_note', type: 'text', nullable: true }) nutritionNote!: string | null;
  @Column({ name: 'allergy_warning', type: 'varchar', length: 500, nullable: true })
  allergyWarning!: string | null;
  @Column({ name: 'display_order', type: 'int', unsigned: true, default: 0 })
  displayOrder!: number;
}
