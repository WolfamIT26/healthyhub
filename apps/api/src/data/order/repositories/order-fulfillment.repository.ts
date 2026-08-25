import type { OrderStatus } from '../entities';
import type { ShipmentStatus } from '../../shipping/entities';

export const ORDER_FULFILLMENT_REPOSITORY = Symbol('ORDER_FULFILLMENT_REPOSITORY');

interface FulfillmentCommandBase {
  orderId: string;
  actorUserAccountId: string | null;
  occurredAt: Date;
  reason?: string;
}

export type OrderFulfillmentCommand =
  | (FulfillmentCommandBase & {
      type: 'mark_shipped' | 'mark_delivered' | 'mark_returned';
      authority: 'shipment_fulfillment';
    })
  | (FulfillmentCommandBase & {
      type: 'cancel_before_shipment';
      authority: 'order_service';
    });

export interface OrderFulfillmentTransitionResult {
  outcome: 'changed' | 'idempotent';
  orderId: string;
  shipmentId: string;
  orderStatus: OrderStatus;
  shippingStatus: ShipmentStatus;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  completedAt: Date | null;
}

export interface OrderFulfillmentRepository {
  transition(command: OrderFulfillmentCommand): Promise<OrderFulfillmentTransitionResult>;
}
