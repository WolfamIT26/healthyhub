import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'product_nutrition_facts' })
@Index('uq_product_nutrition_tenant_product', ['tenantId', 'productId'], { unique: true })
export class ProductNutritionFactEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true }) productId!: string;
  @Column({ name: 'serving_size', type: 'varchar', length: 100, nullable: true }) servingSize!:
    string | null;
  @Column({ type: 'varchar', length: 100, nullable: true }) calories!: string | null;
  @Column({ type: 'varchar', length: 100, nullable: true }) protein!: string | null;
  @Column({ type: 'varchar', length: 100, nullable: true }) carbohydrates!: string | null;
  @Column({ type: 'varchar', length: 100, nullable: true }) fat!: string | null;
  @Column({ type: 'varchar', length: 100, nullable: true }) sugar!: string | null;
  @Column({ type: 'varchar', length: 500, nullable: true }) note!: string | null;
}
