import { Injectable } from '@nestjs/common';
import { DataSource, In, type EntityManager } from 'typeorm';

import { OrderEntity, OrderItemEntity } from '../../order/entities';
import { ProductEntity } from '../../product/entities';
import { ShipmentEntity } from '../../shipping/entities';
import {
  ReviewEligibilityPolicy,
  type ReviewEligibilityEvidence,
} from '../../../domain/review/review-eligibility.policy';
import { ProductReviewEntity } from '../entities';
import type {
  CreateReviewResult,
  ReviewListRow,
  ReviewRatingSummary,
  ReviewRepository,
} from './review.repository';

@Injectable()
export class TypeOrmReviewRepository implements ReviewRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eligibility: ReviewEligibilityPolicy,
  ) {}

  async listPublic(productId: string, offset: number, limit: number) {
    const repository = this.dataSource.getRepository(ProductReviewEntity);
    const [reviews, total] = await repository.findAndCount({
      where: { tenantId: '1', productId, reviewStatus: 'published' },
      order: { publishedAt: 'DESC', id: 'DESC' },
      skip: offset,
      take: limit,
    });
    return { rows: await this.rowsWithEvidence(reviews), total };
  }

  async summarizePublic(productId: string): Promise<ReviewRatingSummary> {
    const raw = await this.dataSource
      .getRepository(ProductReviewEntity)
      .createQueryBuilder('review')
      .select('COUNT(review.id)', 'total')
      .addSelect('AVG(review.rating)', 'average')
      .addSelect('SUM(CASE WHEN review.rating = 1 THEN 1 ELSE 0 END)', 'rating1')
      .addSelect('SUM(CASE WHEN review.rating = 2 THEN 1 ELSE 0 END)', 'rating2')
      .addSelect('SUM(CASE WHEN review.rating = 3 THEN 1 ELSE 0 END)', 'rating3')
      .addSelect('SUM(CASE WHEN review.rating = 4 THEN 1 ELSE 0 END)', 'rating4')
      .addSelect('SUM(CASE WHEN review.rating = 5 THEN 1 ELSE 0 END)', 'rating5')
      .where('review.tenant_id = :tenantId', { tenantId: '1' })
      .andWhere('review.product_id = :productId', { productId })
      .andWhere('review.review_status = :status', { status: 'published' })
      .getRawOne<{
        total: string;
        average: string | null;
        rating1: string | null;
        rating2: string | null;
        rating3: string | null;
        rating4: string | null;
        rating5: string | null;
      }>();
    const total = Number(raw?.total ?? 0);
    return {
      averageRating: total === 0 ? null : Number(Number(raw?.average ?? 0).toFixed(2)),
      totalReviews: total,
      distribution: {
        1: Number(raw?.rating1 ?? 0),
        2: Number(raw?.rating2 ?? 0),
        3: Number(raw?.rating3 ?? 0),
        4: Number(raw?.rating4 ?? 0),
        5: Number(raw?.rating5 ?? 0),
      },
    };
  }

  async listOwned(
    customerProfileId: string,
    productId: string | undefined,
    offset: number,
    limit: number,
  ) {
    const repository = this.dataSource.getRepository(ProductReviewEntity);
    const [reviews, total] = await repository.findAndCount({
      where: {
        tenantId: '1',
        customerProfileId,
        ...(productId ? { productId } : {}),
      },
      order: { submittedAt: 'DESC', id: 'DESC' },
      skip: offset,
      take: limit,
    });
    const products = reviews.length
      ? await this.dataSource.getRepository(ProductEntity).findBy({
          tenantId: '1',
          id: In(Array.from(new Set(reviews.map((review) => review.productId)))),
        })
      : [];
    const productMap = new Map(products.map((product) => [product.id, product]));
    const rows = await this.rowsWithEvidence(reviews);
    return {
      rows: rows.map((row) => {
        const product = productMap.get(row.review.productId);
        return {
          ...row,
          product: product
            ? { productId: product.id, name: product.productName, slug: product.slug }
            : undefined,
        };
      }),
      total,
    };
  }

  async findReviewOpportunity(customerProfileId: string, productId: string) {
    const rows = await this.dataSource.query<Array<{ orderId: string; completedAt: Date }>>(
      `SELECT o.id AS orderId, o.completed_at AS completedAt
       FROM orders o
       INNER JOIN shipments s ON s.tenant_id = o.tenant_id AND s.order_id = o.id AND s.deleted_at IS NULL
       INNER JOIN order_items oi ON oi.tenant_id = o.tenant_id AND oi.order_id = o.id
         AND oi.product_id = ? AND oi.item_status = 'active' AND oi.deleted_at IS NULL
       WHERE o.tenant_id = 1 AND o.customer_profile_id = ? AND o.deleted_at IS NULL
         AND o.order_status = 'completed' AND o.completed_at IS NOT NULL
         AND s.shipping_status = 'delivered' AND s.delivered_at IS NOT NULL
         AND NOT EXISTS (
           SELECT 1 FROM product_reviews r
           WHERE r.tenant_id = o.tenant_id AND r.order_id = o.id AND r.product_id = ?
         )
       ORDER BY o.completed_at DESC, o.id DESC
       LIMIT 1`,
      [productId, customerProfileId, productId],
    );
    return rows[0] ?? null;
  }

  async hasReviewIdentity(customerProfileId: string, productId: string): Promise<boolean> {
    return this.dataSource.getRepository(ProductReviewEntity).exist({
      where: { tenantId: '1', customerProfileId, productId },
      withDeleted: true,
    });
  }

  create(command: {
    customerProfileId: string;
    actorUserAccountId: string;
    orderId: string;
    productId: string;
    rating: number;
    content: string;
  }): Promise<CreateReviewResult> {
    return this.dataSource.transaction(async (manager) => {
      const evidence = await this.lockEvidence(
        manager,
        command.customerProfileId,
        command.orderId,
        command.productId,
      );
      const eligibility = this.eligibility.evaluate(evidence);
      if (!eligibility.eligible) return { outcome: 'ineligible', reason: eligibility.reason };

      const repository = manager.getRepository(ProductReviewEntity);
      const existing = await repository.findOne({
        where: { tenantId: '1', orderId: command.orderId, productId: command.productId },
        withDeleted: true,
        lock: { mode: 'pessimistic_write' },
      });
      if (existing) {
        if (
          !existing.deletedAt &&
          existing.customerProfileId === command.customerProfileId &&
          existing.rating === command.rating &&
          existing.reviewContent === command.content
        ) {
          return { outcome: 'idempotent', review: existing };
        }
        return { outcome: 'duplicate' };
      }

      const now = new Date();
      const review = await repository.save(
        repository.create({
          tenantId: '1',
          customerProfileId: command.customerProfileId,
          orderId: command.orderId,
          productId: command.productId,
          rating: command.rating,
          reviewContent: command.content,
          reviewStatus: 'published',
          submittedAt: now,
          publishedAt: now,
          createdBy: command.actorUserAccountId,
          updatedBy: command.actorUserAccountId,
        }),
      );
      return { outcome: 'created', review };
    });
  }

  updateOwned(command: {
    customerProfileId: string;
    actorUserAccountId: string;
    reviewId: string;
    rating?: number;
    content?: string;
  }): Promise<ProductReviewEntity | null> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(ProductReviewEntity);
      const review = await repository.findOne({
        where: {
          tenantId: '1',
          id: command.reviewId,
          customerProfileId: command.customerProfileId,
        },
        lock: { mode: 'pessimistic_write' },
      });
      if (!review) return null;
      if (command.rating !== undefined) review.rating = command.rating;
      if (command.content !== undefined) review.reviewContent = command.content;
      review.updatedBy = command.actorUserAccountId;
      return repository.save(review);
    });
  }

  deleteOwned(command: {
    customerProfileId: string;
    actorUserAccountId: string;
    reviewId: string;
  }): Promise<{ found: boolean; reviewId: string }> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(ProductReviewEntity);
      const review = await repository.findOne({
        where: {
          tenantId: '1',
          id: command.reviewId,
          customerProfileId: command.customerProfileId,
        },
        withDeleted: true,
        lock: { mode: 'pessimistic_write' },
      });
      if (!review) return { found: false, reviewId: command.reviewId };
      if (!review.deletedAt) {
        review.deletedAt = new Date();
        review.deletedBy = command.actorUserAccountId;
        review.updatedBy = command.actorUserAccountId;
        await repository.save(review);
      }
      return { found: true, reviewId: review.id };
    });
  }

  private async lockEvidence(
    manager: EntityManager,
    customerProfileId: string,
    orderId: string,
    productId: string,
  ): Promise<ReviewEligibilityEvidence | null> {
    const order = await manager.getRepository(OrderEntity).findOne({
      where: { tenantId: '1', id: orderId, customerProfileId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!order) return null;
    const shipment = await manager.getRepository(ShipmentEntity).findOne({
      where: { tenantId: order.tenantId, orderId: order.id },
      lock: { mode: 'pessimistic_write' },
    });
    if (!shipment) return null;
    const productCount = await manager.getRepository(OrderItemEntity).countBy({
      tenantId: order.tenantId,
      orderId: order.id,
      productId,
      itemStatus: 'active',
    });
    return {
      orderId: order.id,
      productId,
      orderStatus: order.orderStatus,
      shippingStatus: shipment.shippingStatus,
      completedAt: order.completedAt,
      deliveredAt: shipment.deliveredAt,
      hasActiveProduct: productCount > 0,
    };
  }

  private async rowsWithEvidence(reviews: ProductReviewEntity[]): Promise<ReviewListRow[]> {
    if (reviews.length === 0) return [];
    const orderIds = Array.from(new Set(reviews.map((review) => review.orderId)));
    const productIds = Array.from(new Set(reviews.map((review) => review.productId)));
    const [orders, shipments, orderItems] = await Promise.all([
      this.dataSource.getRepository(OrderEntity).find({
        where: { tenantId: '1', id: In(orderIds) },
      }),
      this.dataSource.getRepository(ShipmentEntity).find({
        where: { tenantId: '1', orderId: In(orderIds) },
      }),
      this.dataSource.getRepository(OrderItemEntity).find({
        where: {
          tenantId: '1',
          orderId: In(orderIds),
          productId: In(productIds),
          itemStatus: 'active',
        },
      }),
    ]);
    const orderMap = new Map(orders.map((order) => [order.id, order]));
    const shipmentMap = new Map(shipments.map((shipment) => [shipment.orderId, shipment]));
    const activeProducts = new Set(
      orderItems.map((item) => `${item.orderId}:${item.productId ?? ''}`),
    );
    return reviews.map((review) => {
      const order = orderMap.get(review.orderId);
      const shipment = shipmentMap.get(review.orderId);
      return {
        review,
        verifiedPurchase: Boolean(
          order?.orderStatus === 'completed' &&
          order.completedAt &&
          shipment?.shippingStatus === 'delivered' &&
          shipment.deliveredAt &&
          activeProducts.has(`${review.orderId}:${review.productId}`),
        ),
      };
    });
  }
}
