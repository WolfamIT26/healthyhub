import { Injectable } from '@nestjs/common';

import type { OrderStatus } from '../../data/order/entities';
import type { PaymentEntity } from '../../data/payment/entities';
import type { ShipmentStatus } from '../../data/shipping/entities';

export type OrderFulfillmentErrorCode =
  | 'ORDER_FULFILLMENT_NOT_FOUND'
  | 'ORDER_FULFILLMENT_INVALID_TRANSITION'
  | 'ORDER_FULFILLMENT_PAYMENT_NOT_READY'
  | 'ORDER_FULFILLMENT_REASON_REQUIRED'
  | 'ORDER_FULFILLMENT_INVALID_TIMESTAMP';

export class OrderFulfillmentError extends Error {
  constructor(
    readonly code: OrderFulfillmentErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'OrderFulfillmentError';
  }
}

const ORDER_TRANSITIONS: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = Object.freeze({
  new: ['completed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: ['returned'],
  cancelled: [],
  returned: [],
});

const SHIPMENT_TRANSITIONS: Readonly<Record<ShipmentStatus, readonly ShipmentStatus[]>> =
  Object.freeze({
    pending: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: ['returned'],
    cancelled: [],
    returned: [],
  });

@Injectable()
export class OrderFulfillmentPolicy {
  assertOrderTransition(from: OrderStatus, to: OrderStatus): 'changed' | 'idempotent' {
    if (from === to) return 'idempotent';
    if (!ORDER_TRANSITIONS[from].includes(to)) {
      throw new OrderFulfillmentError(
        'ORDER_FULFILLMENT_INVALID_TRANSITION',
        `Order transition không hợp lệ: ${from} -> ${to}.`,
      );
    }
    return 'changed';
  }

  assertShipmentTransition(from: ShipmentStatus, to: ShipmentStatus): 'changed' | 'idempotent' {
    if (from === to) return 'idempotent';
    if (!SHIPMENT_TRANSITIONS[from].includes(to)) {
      throw new OrderFulfillmentError(
        'ORDER_FULFILLMENT_INVALID_TRANSITION',
        `Shipment transition không hợp lệ: ${from} -> ${to}.`,
      );
    }
    return 'changed';
  }

  assertReadyForShipment(
    paymentMethod: PaymentEntity['paymentMethod'],
    paymentStatus: PaymentEntity['paymentStatus'],
    orderStatus: OrderStatus,
  ): void {
    if (paymentMethod === 'cod') return;
    if (paymentMethod === 'vnpay' && paymentStatus === 'paid' && orderStatus === 'confirmed')
      return;
    throw new OrderFulfillmentError(
      'ORDER_FULFILLMENT_PAYMENT_NOT_READY',
      'VNPAY Order chỉ được fulfillment sau verified paid confirmation.',
    );
  }

  normalizeReason(reason: string | undefined, required: boolean): string | null {
    const normalized = reason?.trim() ?? '';
    if (required && !normalized) {
      throw new OrderFulfillmentError(
        'ORDER_FULFILLMENT_REASON_REQUIRED',
        'Transition này yêu cầu reason.',
      );
    }
    if (normalized.length > 500) {
      throw new OrderFulfillmentError(
        'ORDER_FULFILLMENT_REASON_REQUIRED',
        'Transition reason không được vượt quá 500 ký tự.',
      );
    }
    return normalized || null;
  }

  assertTimestamp(value: Date): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new OrderFulfillmentError(
        'ORDER_FULFILLMENT_INVALID_TIMESTAMP',
        'Transition timestamp không hợp lệ.',
      );
    }
  }

  assertNotBefore(value: Date, lowerBound: Date | null, label: string): void {
    if (lowerBound && value.getTime() < lowerBound.getTime()) {
      throw new OrderFulfillmentError(
        'ORDER_FULFILLMENT_INVALID_TIMESTAMP',
        `${label} không được trước transition trước đó.`,
      );
    }
  }
}
