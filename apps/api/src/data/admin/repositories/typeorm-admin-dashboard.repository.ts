import {
  ADMIN_ORDER_STATUSES,
  ADMIN_REVIEW_STATUSES,
  type AdminDashboardMetrics,
  type AdminOrderStatus,
  type AdminReviewStatus,
} from '@healthyhub/shared-types';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { InventoryItemEntity } from '../../inventory/entities';
import { OrderEntity } from '../../order/entities';
import { ProductEntity } from '../../product/entities';
import { ProductReviewEntity } from '../../review/entities';
import type { AdminDashboardRepository } from './admin-dashboard.repository';

interface ProductMetricRow {
  total: string;
  activePublic: string | null;
  unavailable: string | null;
}

interface StatusMetricRow<TStatus extends string> {
  status: TStatus;
  total: string;
}

@Injectable()
export class TypeOrmAdminDashboardRepository implements AdminDashboardRepository {
  constructor(private readonly dataSource: DataSource) {}

  async readMetrics(tenantId: string): Promise<AdminDashboardMetrics> {
    const [products, orders, reviews] = await Promise.all([
      this.productMetrics(tenantId),
      this.statusMetrics<OrderEntity, AdminOrderStatus>(
        OrderEntity,
        'order',
        'order.order_status',
        tenantId,
      ),
      this.statusMetrics<ProductReviewEntity, AdminReviewStatus>(
        ProductReviewEntity,
        'review',
        'review.review_status',
        tenantId,
      ),
    ]);

    const ordersByStatus = Object.fromEntries(
      ADMIN_ORDER_STATUSES.map((status) => [status, 0]),
    ) as Record<AdminOrderStatus, number>;
    for (const row of orders) ordersByStatus[row.status] = Number(row.total);

    const reviewsByStatus = Object.fromEntries(
      ADMIN_REVIEW_STATUSES.map((status) => [status, 0]),
    ) as Record<AdminReviewStatus, number>;
    for (const row of reviews) reviewsByStatus[row.status] = Number(row.total);

    return {
      products: {
        total: Number(products.total),
        activePublic: Number(products.activePublic ?? 0),
        unavailable: Number(products.unavailable ?? 0),
      },
      orders: {
        total: Object.values(ordersByStatus).reduce((sum, count) => sum + count, 0),
        byStatus: ordersByStatus,
      },
      reviews: {
        total: Object.values(reviewsByStatus).reduce((sum, count) => sum + count, 0),
        byStatus: reviewsByStatus,
      },
    };
  }

  private productMetrics(tenantId: string): Promise<ProductMetricRow> {
    return this.dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoin(
        InventoryItemEntity,
        'inventory',
        'inventory.product_id = product.id AND inventory.tenant_id = :tenantId AND inventory.deleted_at IS NULL',
        { tenantId },
      )
      .select('COUNT(product.id)', 'total')
      .addSelect(
        "SUM(CASE WHEN product.product_status = 'active' AND product.product_visibility = 'public' THEN 1 ELSE 0 END)",
        'activePublic',
      )
      .addSelect(
        `SUM(CASE WHEN product.product_status = 'active'
          AND product.product_visibility = 'public'
          AND (
            product.sellable_status IN ('out_of_stock', 'unavailable')
            OR inventory.id IS NULL
            OR inventory.stock_status IN ('out_of_stock', 'disabled')
            OR inventory.available_quantity = 0
          ) THEN 1 ELSE 0 END)`,
        'unavailable',
      )
      .where('product.tenant_id = :tenantId', { tenantId })
      .andWhere('product.deleted_at IS NULL')
      .getRawOne<ProductMetricRow>()
      .then((row) => row ?? { total: '0', activePublic: '0', unavailable: '0' });
  }

  private statusMetrics<TEntity extends object, TStatus extends string>(
    entity: new () => TEntity,
    alias: string,
    statusColumn: string,
    tenantId: string,
  ): Promise<Array<StatusMetricRow<TStatus>>> {
    return this.dataSource
      .getRepository(entity)
      .createQueryBuilder(alias)
      .select(statusColumn, 'status')
      .addSelect(`COUNT(${alias}.id)`, 'total')
      .where(`${alias}.tenant_id = :tenantId`, { tenantId })
      .andWhere(`${alias}.deleted_at IS NULL`)
      .groupBy(statusColumn)
      .getRawMany<StatusMetricRow<TStatus>>();
  }
}
