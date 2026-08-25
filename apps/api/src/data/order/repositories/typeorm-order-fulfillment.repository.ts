import { Injectable } from '@nestjs/common';
import { DataSource, type EntityManager } from 'typeorm';

import { InventoryStockMutationRepository } from '../../inventory/repositories';
import { PaymentEntity } from '../../payment/entities';
import {
  ShipmentEntity,
  ShippingStatusHistoryEntity,
  type ShipmentStatus,
} from '../../shipping/entities';
import {
  OrderFulfillmentPolicy,
  OrderFulfillmentError,
} from '../../../domain/order/order-fulfillment.policy';
import { OrderEntity, OrderStatusHistoryEntity, type OrderStatus } from '../entities';
import type {
  OrderFulfillmentCommand,
  OrderFulfillmentRepository,
  OrderFulfillmentTransitionResult,
} from './order-fulfillment.repository';

@Injectable()
export class TypeOrmOrderFulfillmentRepository implements OrderFulfillmentRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly policy: OrderFulfillmentPolicy,
    private readonly stockMutations: InventoryStockMutationRepository,
  ) {}

  transition(command: OrderFulfillmentCommand): Promise<OrderFulfillmentTransitionResult> {
    this.policy.assertTimestamp(command.occurredAt);
    const reason = this.policy.normalizeReason(
      command.reason,
      command.type === 'cancel_before_shipment' || command.type === 'mark_returned',
    );
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.getRepository(OrderEntity).findOne({
        where: { tenantId: '1', id: command.orderId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order) this.notFound();
      const shipment = await manager.getRepository(ShipmentEntity).findOne({
        where: { tenantId: order!.tenantId, orderId: order!.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!shipment) this.notFound();
      this.policy.assertNotBefore(command.occurredAt, order!.placedAt, 'Fulfillment timestamp');

      if (command.type === 'mark_shipped') {
        return this.markShipped(manager, order!, shipment!, command, reason);
      }
      if (command.type === 'mark_delivered') {
        return this.markDelivered(manager, order!, shipment!, command, reason);
      }
      if (command.type === 'cancel_before_shipment') {
        return this.cancelBeforeShipment(manager, order!, shipment!, command, reason!);
      }
      return this.markReturned(manager, order!, shipment!, command, reason!);
    });
  }

  private async markShipped(
    manager: EntityManager,
    order: OrderEntity,
    shipment: ShipmentEntity,
    command: OrderFulfillmentCommand,
    reason: string | null,
  ) {
    if (shipment.shippingStatus === 'shipped') return this.result('idempotent', order, shipment);
    const payment = await this.requirePayment(manager, order.id);
    this.policy.assertReadyForShipment(
      payment.paymentMethod,
      payment.paymentStatus,
      order.orderStatus,
    );
    this.policy.assertShipmentTransition(shipment.shippingStatus, 'shipped');
    const from = shipment.shippingStatus;
    shipment.shippingStatus = 'shipped';
    shipment.shippedAt = command.occurredAt;
    shipment.updatedBy = command.actorUserAccountId;
    order.shippingStatusSnapshot = 'shipped';
    order.updatedBy = command.actorUserAccountId;
    await this.saveShipmentTransition(manager, shipment, from, 'shipped', command, reason);
    await manager.getRepository(OrderEntity).save(order);
    return this.result('changed', order, shipment);
  }

  private async markDelivered(
    manager: EntityManager,
    order: OrderEntity,
    shipment: ShipmentEntity,
    command: OrderFulfillmentCommand,
    reason: string | null,
  ) {
    if (shipment.shippingStatus === 'delivered' && order.orderStatus === 'completed') {
      return this.result('idempotent', order, shipment);
    }
    if (shipment.shippingStatus === 'delivered' || order.orderStatus === 'completed') {
      this.invariant('Order/Shipment delivered state không đồng bộ.');
    }
    const payment = await this.requirePayment(manager, order.id);
    this.policy.assertReadyForShipment(
      payment.paymentMethod,
      payment.paymentStatus,
      order.orderStatus,
    );
    this.policy.assertShipmentTransition(shipment.shippingStatus, 'delivered');
    this.policy.assertOrderTransition(order.orderStatus, 'completed');
    this.policy.assertNotBefore(command.occurredAt, shipment.shippedAt, 'Delivered timestamp');
    const fromShipment = shipment.shippingStatus;
    const fromOrder = order.orderStatus;
    shipment.shippingStatus = 'delivered';
    shipment.shippedAt ??= command.occurredAt;
    shipment.deliveredAt = command.occurredAt;
    shipment.updatedBy = command.actorUserAccountId;
    order.orderStatus = 'completed';
    order.shippingStatusSnapshot = 'delivered';
    order.completedAt = command.occurredAt;
    order.updatedBy = command.actorUserAccountId;
    await this.saveShipmentTransition(
      manager,
      shipment,
      fromShipment,
      'delivered',
      command,
      reason,
    );
    await this.saveOrderTransition(
      manager,
      order,
      fromOrder,
      'completed',
      command,
      reason ?? 'Shipment delivered',
    );
    return this.result('changed', order, shipment);
  }

  private async cancelBeforeShipment(
    manager: EntityManager,
    order: OrderEntity,
    shipment: ShipmentEntity,
    command: OrderFulfillmentCommand,
    reason: string,
  ) {
    if (shipment.shippingStatus === 'cancelled' && order.orderStatus === 'cancelled') {
      return this.result('idempotent', order, shipment);
    }
    if (shipment.shippingStatus === 'cancelled' || order.orderStatus === 'cancelled') {
      this.invariant('Order/Shipment cancelled state không đồng bộ.');
    }
    this.policy.assertShipmentTransition(shipment.shippingStatus, 'cancelled');
    this.policy.assertOrderTransition(order.orderStatus, 'cancelled');
    const fromShipment = shipment.shippingStatus;
    const fromOrder = order.orderStatus;
    await this.stockMutations.restoreForOrder(
      manager,
      order.id,
      command.actorUserAccountId,
      order.tenantId,
    );
    shipment.shippingStatus = 'cancelled';
    shipment.updatedBy = command.actorUserAccountId;
    order.orderStatus = 'cancelled';
    order.shippingStatusSnapshot = 'cancelled';
    order.updatedBy = command.actorUserAccountId;
    await this.saveShipmentTransition(
      manager,
      shipment,
      fromShipment,
      'cancelled',
      command,
      reason,
    );
    await this.saveOrderTransition(manager, order, fromOrder, 'cancelled', command, reason);
    return this.result('changed', order, shipment);
  }

  private async markReturned(
    manager: EntityManager,
    order: OrderEntity,
    shipment: ShipmentEntity,
    command: OrderFulfillmentCommand,
    reason: string,
  ) {
    if (shipment.shippingStatus === 'returned' && order.orderStatus === 'returned') {
      return this.result('idempotent', order, shipment);
    }
    if (shipment.shippingStatus === 'returned' || order.orderStatus === 'returned') {
      this.invariant('Order/Shipment returned state không đồng bộ.');
    }
    this.policy.assertShipmentTransition(shipment.shippingStatus, 'returned');
    this.policy.assertOrderTransition(order.orderStatus, 'returned');
    this.policy.assertNotBefore(command.occurredAt, shipment.deliveredAt, 'Returned timestamp');
    const fromShipment = shipment.shippingStatus;
    const fromOrder = order.orderStatus;
    await this.stockMutations.restockForOrder(
      manager,
      order.id,
      command.actorUserAccountId,
      order.tenantId,
    );
    shipment.shippingStatus = 'returned';
    shipment.updatedBy = command.actorUserAccountId;
    order.orderStatus = 'returned';
    order.shippingStatusSnapshot = 'returned';
    order.updatedBy = command.actorUserAccountId;
    await this.saveShipmentTransition(manager, shipment, fromShipment, 'returned', command, reason);
    await this.saveOrderTransition(manager, order, fromOrder, 'returned', command, reason);
    return this.result('changed', order, shipment);
  }

  private async requirePayment(manager: EntityManager, orderId: string): Promise<PaymentEntity> {
    const payment = await manager
      .getRepository(PaymentEntity)
      .findOneBy({ tenantId: '1', orderId });
    if (!payment) this.notFound();
    return payment!;
  }

  private async saveOrderTransition(
    manager: EntityManager,
    order: OrderEntity,
    fromStatus: OrderStatus,
    toStatus: OrderStatus,
    command: OrderFulfillmentCommand,
    reason: string | null,
  ): Promise<void> {
    await manager.getRepository(OrderEntity).save(order);
    const histories = manager.getRepository(OrderStatusHistoryEntity);
    await histories.save(
      histories.create({
        tenantId: order.tenantId,
        orderId: order.id,
        fromStatus,
        toStatus,
        reason,
        changedAt: command.occurredAt,
        changedBy: command.actorUserAccountId,
        createdBy: command.actorUserAccountId,
        updatedBy: command.actorUserAccountId,
      }),
    );
  }

  private async saveShipmentTransition(
    manager: EntityManager,
    shipment: ShipmentEntity,
    fromStatus: ShipmentStatus,
    toStatus: ShipmentStatus,
    command: OrderFulfillmentCommand,
    reason: string | null,
  ): Promise<void> {
    await manager.getRepository(ShipmentEntity).save(shipment);
    const histories = manager.getRepository(ShippingStatusHistoryEntity);
    await histories.save(
      histories.create({
        tenantId: shipment.tenantId,
        shipmentId: shipment.id,
        fromStatus,
        toStatus,
        reason,
        changedAt: command.occurredAt,
        changedBy: command.actorUserAccountId,
        createdBy: command.actorUserAccountId,
        updatedBy: command.actorUserAccountId,
      }),
    );
  }

  private result(
    outcome: 'changed' | 'idempotent',
    order: OrderEntity,
    shipment: ShipmentEntity,
  ): OrderFulfillmentTransitionResult {
    return {
      outcome,
      orderId: order.id,
      shipmentId: shipment.id,
      orderStatus: order.orderStatus,
      shippingStatus: shipment.shippingStatus,
      shippedAt: shipment.shippedAt,
      deliveredAt: shipment.deliveredAt,
      completedAt: order.completedAt,
    };
  }

  private notFound(): never {
    throw new OrderFulfillmentError(
      'ORDER_FULFILLMENT_NOT_FOUND',
      'Không tìm thấy Order fulfillment aggregate.',
    );
  }

  private invariant(message: string): never {
    throw new OrderFulfillmentError('ORDER_FULFILLMENT_INVALID_TRANSITION', message);
  }
}
