import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { OrderEntity, OrderItemEntity } from '../../order/entities';
import { ShipmentEntity } from '../../shipping/entities';
import type { ReviewEligibilityRepository } from '../../../domain/review/review-eligibility.repository';

@Injectable()
export class TypeOrmReviewEligibilityRepository implements ReviewEligibilityRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findEvidence(customerProfileId: string, orderId: string, productId: string) {
    const order = await this.dataSource.getRepository(OrderEntity).findOneBy({
      tenantId: '1',
      id: orderId,
      customerProfileId,
    });
    if (!order) return null;
    const [shipment, productCount] = await Promise.all([
      this.dataSource
        .getRepository(ShipmentEntity)
        .findOneBy({ tenantId: order.tenantId, orderId: order.id }),
      this.dataSource.getRepository(OrderItemEntity).countBy({
        tenantId: order.tenantId,
        orderId: order.id,
        productId,
        itemStatus: 'active',
      }),
    ]);
    if (!shipment) return null;
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
}
