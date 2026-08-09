import { Injectable } from '@nestjs/common';
import { DataSource, type EntityManager } from 'typeorm';

import { OrderEntity, OrderItemEntity } from '../entities';
import { PaymentEntity } from '../../payment/entities';
import { ShipmentEntity, ShippingAddressEntity } from '../../shipping/entities';
import type { OrderRepository, OrderSnapshotInput, PersistedOrderAggregate } from './order.repository';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByIdempotency(customerProfileId: string, idempotencyKeyHash: string): Promise<PersistedOrderAggregate | null> {
    const order = await this.dataSource.getRepository(OrderEntity).findOneBy({
      tenantId: '1', customerProfileId, idempotencyKeyHash,
    });
    return order ? this.loadAggregate(this.dataSource.manager, order) : null;
  }

  createSnapshot(input: OrderSnapshotInput): Promise<PersistedOrderAggregate> {
    return this.dataSource.transaction(async (manager) => {
      const orders = manager.getRepository(OrderEntity);
      const now = new Date();
      const order = await orders.save(orders.create({
        tenantId: '1', customerProfileId: input.customerProfileId, cartId: input.cartId,
        orderCode: input.orderCode, orderSource: 'web', orderStatus: 'new',
        paymentStatusSnapshot: 'pending', shippingStatusSnapshot: 'pending', orderTotal: input.orderTotal,
        idempotencyKeyHash: input.idempotencyKeyHash, requestHash: input.requestHash,
        placedAt: now, completedAt: null, createdBy: input.actorUserAccountId, updatedBy: input.actorUserAccountId,
      }));
      const itemRepository = manager.getRepository(OrderItemEntity);
      const items = await itemRepository.save(input.items.map((item) => itemRepository.create({
        tenantId: '1', orderId: order.id, productId: item.productId,
        productNameSnapshot: item.productName, skuSnapshot: item.sku,
        unitPriceSnapshot: item.unitPrice, quantity: item.quantity, lineTotal: item.lineTotal,
        itemStatus: 'active', createdBy: input.actorUserAccountId, updatedBy: input.actorUserAccountId,
      })));
      const paymentRepository = manager.getRepository(PaymentEntity);
      const payment = await paymentRepository.save(paymentRepository.create({
        tenantId: '1', orderId: order.id, paymentMethod: input.payment.method,
        paymentAmount: input.payment.amount, paymentStatus: input.payment.status,
        paidAt: null, providerReference: null, createdBy: input.actorUserAccountId, updatedBy: input.actorUserAccountId,
      }));
      const shipmentRepository = manager.getRepository(ShipmentEntity);
      const shipment = await shipmentRepository.save(shipmentRepository.create({
        tenantId: '1', orderId: order.id, shippingMethod: input.shipping.method,
        shippingFee: input.shipping.fee, shippingStatus: 'pending', trackingReference: null,
        shippedAt: null, deliveredAt: null, createdBy: input.actorUserAccountId, updatedBy: input.actorUserAccountId,
      }));
      const addressRepository = manager.getRepository(ShippingAddressEntity);
      const shippingAddress = await addressRepository.save(addressRepository.create({
        tenantId: '1', shipmentId: shipment.id, customerAddressId: null,
        recipientName: input.shipping.address.recipientName, recipientPhone: input.shipping.address.phone,
        addressText: input.shipping.address.addressText, deliveryNote: input.shipping.address.note,
        addressSnapshotStatus: 'active', createdBy: input.actorUserAccountId, updatedBy: input.actorUserAccountId,
      }));
      return { order, items, payment, shipment, shippingAddress };
    });
  }

  private async loadAggregate(manager: EntityManager, order: OrderEntity): Promise<PersistedOrderAggregate> {
    const [items, payment, shipment] = await Promise.all([
      manager.getRepository(OrderItemEntity).find({ where: { orderId: order.id, itemStatus: 'active' }, order: { id: 'ASC' } }),
      manager.getRepository(PaymentEntity).findOneByOrFail({ orderId: order.id }),
      manager.getRepository(ShipmentEntity).findOneByOrFail({ orderId: order.id }),
    ]);
    const shippingAddress = await manager.getRepository(ShippingAddressEntity).findOneByOrFail({
      shipmentId: shipment.id, addressSnapshotStatus: 'active',
    });
    return { order, items, payment, shipment, shippingAddress };
  }
}
