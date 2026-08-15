import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'category_display_rules' })
@Index(
  'uq_category_display_tenant_category_channel',
  ['tenantId', 'categoryId', 'displayChannel'],
  {
    unique: true,
  },
)
@Index('idx_category_display_channel_order', [
  'tenantId',
  'displayChannel',
  'ruleStatus',
  'displayOrder',
])
export class CategoryDisplayRuleEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'category_id', type: 'bigint', unsigned: true }) categoryId!: string;
  @Column({ name: 'display_channel', type: 'varchar', length: 32, default: 'web' })
  displayChannel!: 'web' | 'mobile' | 'admin';
  @Column({ name: 'display_order', type: 'int', unsigned: true, default: 0 })
  displayOrder!: number;
  @Column({ name: 'rule_status', type: 'varchar', length: 32, default: 'active' }) ruleStatus!:
    'active' | 'inactive' | 'expired';
  @Column({ name: 'effective_from', type: 'datetime', precision: 3 }) effectiveFrom!: Date;
  @Column({ name: 'effective_to', type: 'datetime', precision: 3, nullable: true })
  effectiveTo!: Date | null;
}
