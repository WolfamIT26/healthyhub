import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

export type ReviewStatus = 'published' | 'hidden' | 'rejected';

@Entity({ name: 'product_reviews' })
@Index('uq_product_reviews_tenant_order_product', ['tenantId', 'orderId', 'productId'], {
  unique: true,
})
@Index('idx_product_reviews_public', ['tenantId', 'productId', 'reviewStatus', 'publishedAt'])
@Index('idx_product_reviews_customer', ['tenantId', 'customerProfileId', 'submittedAt'])
export class ProductReviewEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'customer_profile_id', type: 'bigint', unsigned: true })
  customerProfileId!: string;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true }) productId!: string;
  @Column({ name: 'order_id', type: 'bigint', unsigned: true }) orderId!: string;
  @Column({ type: 'tinyint', unsigned: true }) rating!: number;
  @Column({ name: 'review_content', type: 'text' }) reviewContent!: string;
  @Column({ name: 'review_status', type: 'varchar', length: 32, default: 'published' })
  reviewStatus!: ReviewStatus;
  @Column({ name: 'submitted_at', type: 'datetime', precision: 3 }) submittedAt!: Date;
  @Column({ name: 'published_at', type: 'datetime', precision: 3, nullable: true })
  publishedAt!: Date | null;
}
