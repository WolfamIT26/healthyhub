import { Injectable } from '@nestjs/common';

export const PAYMENT_STATUSES = [
  'unpaid',
  'pending',
  'paid',
  'failed',
  'refunded',
  'partially_refunded',
  'cancelled',
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

const TRANSITIONS: Readonly<Record<PaymentStatus, readonly PaymentStatus[]>> = Object.freeze({
  unpaid: ['pending', 'cancelled'],
  pending: ['paid', 'failed', 'cancelled'],
  failed: ['paid', 'cancelled'],
  paid: ['partially_refunded', 'refunded'],
  partially_refunded: ['refunded'],
  cancelled: [],
  refunded: [],
});

export class InvalidPaymentTransitionError extends Error {
  readonly code = 'PAYMENT_INVALID_STATUS_TRANSITION';
  constructor(
    readonly from: PaymentStatus,
    readonly to: PaymentStatus,
  ) {
    super(`Payment transition không hợp lệ: ${from} -> ${to}.`);
  }
}

@Injectable()
export class PaymentLifecyclePolicy {
  assertTransition(from: PaymentStatus, to: PaymentStatus): 'changed' | 'idempotent' {
    if (from === to) return 'idempotent';
    if (!TRANSITIONS[from].includes(to)) throw new InvalidPaymentTransitionError(from, to);
    return 'changed';
  }
}
