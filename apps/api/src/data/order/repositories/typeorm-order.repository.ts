import { Injectable } from '@nestjs/common';
import { DataSource, In, type EntityManager } from 'typeorm';

import { OrderEntity, OrderItemEntity } from '../entities';
import { PaymentEntity } from '../../payment/entities';
import { ShipmentEntity, ShippingAddressEntity } from '../../shipping/entities';
import type {
  CustomerOrderListQuery,
  OrderRepository,
  OrderSnapshotInput,
  PersistedCustomerOrderPage,
  PersistedOrderAggregate,
} from './order.repository';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByIdempotency(
    customerProfileId: string,
    idempotencyKeyHash: string,
  ): Promise<PersistedOrderAggregate | null> {
    const order = await this.dataSource.getRepository(OrderEntity).findOneBy({
      tenantId: '1',
      customerProfileId,
      idempotencyKeyHash,
    });
    return order ? this.loadAggregate(this.dataSource.manager, order) : null;
  }

  async findCustomerPage(
    customerProfileId: string,
    query: CustomerOrderListQuery,
  ): Promise<PersistedCustomerOrderPage> {
    const orderQuery = this.dataSource
      .getRepository(OrderEntity)
      .createQueryBuilder('customer_order')
      .innerJoin(
        PaymentEntity,
        'customer_payment',
        'customer_payment.orderId = customer_order.id AND customer_payment.tenantId = customer_order.tenantId AND customer_payment.deletedAt IS NULL',
      )
      .innerJoin(
        ShipmentEntity,
        'customer_shipment',
        'customer_shipment.orderId = customer_order.id AND customer_shipment.tenantId = customer_order.tenantId AND customer_shipment.deletedAt IS NULL',
      )
      .where('customer_order.tenantId = :tenantId', { tenantId: '1' })
      .andWhere('customer_order.customerProfileId = :customerProfileId', { customerProfileId });

    if (query.orderStatus) {
      orderQuery.andWhere('customer_order.orderStatus = :orderStatus', {
        orderStatus: query.orderStatus,
      });
    }
    if (query.paymentStatus) {
      orderQuery.andWhere('customer_payment.paymentStatus = :paymentStatus', {
        paymentStatus: query.paymentStatus,
      });
    }
    if (query.shippingStatus) {
      orderQuery.andWhere('customer_shipment.shippingStatus = :shippingStatus', {
        shippingStatus: query.shippingStatus,
      });
    }
    if (query.dateFrom) {
      orderQuery.andWhere('customer_order.placedAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      orderQuery.andWhere('customer_order.placedAt <= :dateTo', { dateTo: query.dateTo });
    }

    const [orders, totalItems] = await orderQuery
      .orderBy('customer_order.placedAt', 'DESC')
      .addOrderBy('customer_order.id', 'DESC')
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getManyAndCount();

    if (!orders.length) return { items: [], totalItems };
    const orderIds = orders.map((order) => order.id);
    const [payments, shipments, orderItems] = await Promise.all([
      this.dataSource.getRepository(PaymentEntity).find({
        where: { tenantId: '1', orderId: In(orderIds) },
      }),
      this.dataSource.getRepository(ShipmentEntity).find({
        where: { tenantId: '1', orderId: In(orderIds) },
      }),
      this.dataSource.getRepository(OrderItemEntity).find({
        where: { tenantId: '1', orderId: In(orderIds), itemStatus: 'active' },
      }),
    ]);
    const paymentByOrder = new Map(payments.map((payment) => [payment.orderId, payment]));
    const shipmentByOrder = new Map(shipments.map((shipment) => [shipment.orderId, shipment]));
    const itemCountByOrder = new Map<string, number>();
    for (const item of orderItems) {
      itemCountByOrder.set(item.orderId, (itemCountByOrder.get(item.orderId) ?? 0) + item.quantity);
    }

    return {
      totalItems,
      items: orders.map((order) => {
        const payment = paymentByOrder.get(order.id);
        const shipment = shipmentByOrder.get(order.id);
        if (!payment || !shipment) throw new Error('Order aggregate persistence invariant failed.');
        return {
          order,
          payment,
          shipment,
          itemCount: itemCountByOrder.get(order.id) ?? 0,
        };
      }),
    };
  }

  async findCustomerById(
    customerProfileId: string,
    orderId: string,
  ): Promise<PersistedOrderAggregate | null> {
    const order = await this.dataSource.getRepository(OrderEntity).findOneBy({
      tenantId: '1',
      customerProfileId,
      id: orderId,
    });
    return order ? this.loadAggregate(this.dataSource.manager, order) : null;
  }

  createSnapshot(input: OrderSnapshotInput): Promise<PersistedOrderAggregate> {
    return this.dataSource.transaction(async (manager) => {
      const orders = manager.getRepository(OrderEntity);
      const now = new Date();
      const order = await orders.save(
        orders.create({
          tenantId: '1',
          customerProfileId: input.customerProfileId,
          cartId: input.cartId,
          orderCode: input.orderCode,
          orderSource: 'web',
          orderStatus: 'new',
          paymentStatusSnapshot: 'pending',
          shippingStatusSnapshot: 'pending',
          orderTotal: input.orderTotal,
          idempotencyKeyHash: input.idempotencyKeyHash,
          requestHash: input.requestHash,
          placedAt: now,
          completedAt: null,
          createdBy: input.actorUserAccountId,
          updatedBy: input.actorUserAccountId,
        }),
      );
      const itemRepository = manager.getRepository(OrderItemEntity);
      const items = await itemRepository.save(
        input.items.map((item) =>
          itemRepository.create({
            tenantId: '1',
            orderId: order.id,
            productId: item.productId,
            productNameSnapshot: item.productName,
            skuSnapshot: item.sku,
            unitPriceSnapshot: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
            itemStatus: 'active',
            createdBy: input.actorUserAccountId,
            updatedBy: input.actorUserAccountId,
          }),
        ),
      );
      const paymentRepository = manager.getRepository(PaymentEntity);
      const payment = await paymentRepository.save(
        paymentRepository.create({
          tenantId: '1',
          orderId: order.id,
          paymentMethod: input.payment.method,
          paymentAmount: input.payment.amount,
          paymentStatus: input.payment.status,
          paidAt: null,
          providerReference: null,
          createdBy: input.actorUserAccountId,
          updatedBy: input.actorUserAccountId,
        }),
      );
      const shipmentRepository = manager.getRepository(ShipmentEntity);
      const shipment = await shipmentRepository.save(
        shipmentRepository.create({
          tenantId: '1',
          orderId: order.id,
          shippingMethod: input.shipping.method,
          shippingFee: input.shipping.fee,
          shippingStatus: 'pending',
          trackingReference: null,
          shippedAt: null,
          deliveredAt: null,
          createdBy: input.actorUserAccountId,
          updatedBy: input.actorUserAccountId,
        }),
      );
      const addressRepository = manager.getRepository(ShippingAddressEntity);
      const shippingAddress = await addressRepository.save(
        addressRepository.create({
          tenantId: '1',
          shipmentId: shipment.id,
          customerAddressId: null,
          recipientName: input.shipping.address.recipientName,
          recipientPhone: input.shipping.address.phone,
          addressText: input.shipping.address.addressText,
          deliveryNote: input.shipping.address.note,
          addressSnapshotStatus: 'active',
          createdBy: input.actorUserAccountId,
          updatedBy: input.actorUserAccountId,
        }),
      );
      return { order, items, payment, shipment, shippingAddress };
    });
  }

  private async loadAggregate(
    manager: EntityManager,
    order: OrderEntity,
  ): Promise<PersistedOrderAggregate> {
    const [items, payment, shipment] = await Promise.all([
      manager.getRepository(OrderItemEntity).find({
        where: { tenantId: order.tenantId, orderId: order.id, itemStatus: 'active' },
        order: { id: 'ASC' },
      }),
      manager.getRepository(PaymentEntity).findOneByOrFail({
        tenantId: order.tenantId,
        orderId: order.id,
      }),
      manager.getRepository(ShipmentEntity).findOneByOrFail({
        tenantId: order.tenantId,
        orderId: order.id,
      }),
    ]);
    const shippingAddress = await manager.getRepository(ShippingAddressEntity).findOneByOrFail({
      tenantId: order.tenantId,
      shipmentId: shipment.id,
      addressSnapshotStatus: 'active',
    });
    return { order, items, payment, shipment, shippingAddress };
  }
}
