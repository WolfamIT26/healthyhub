import { describe, expect, it } from 'vitest';

import { OrderFulfillmentError, OrderFulfillmentPolicy } from './order-fulfillment.policy';

describe('OrderFulfillmentPolicy', () => {
  const policy = new OrderFulfillmentPolicy();

  it('keeps Order and Shipment as separate minimal state machines', () => {
    expect(policy.assertShipmentTransition('pending', 'shipped')).toBe('changed');
    expect(policy.assertShipmentTransition('shipped', 'delivered')).toBe('changed');
    expect(policy.assertOrderTransition('new', 'completed')).toBe('changed');
    expect(policy.assertOrderTransition('confirmed', 'completed')).toBe('changed');
    expect(policy.assertOrderTransition('completed', 'returned')).toBe('changed');
  });

  it('rejects skipped, regressive and post-terminal transitions', () => {
    for (const transition of [
      () => policy.assertShipmentTransition('pending', 'delivered'),
      () => policy.assertShipmentTransition('delivered', 'shipped'),
      () => policy.assertOrderTransition('completed', 'cancelled'),
      () => policy.assertOrderTransition('cancelled', 'completed'),
    ]) {
      expect(transition).toThrow(OrderFulfillmentError);
    }
  });

  it('allows COD fulfillment while payment is pending', () => {
    expect(() => policy.assertReadyForShipment('cod', 'pending', 'new')).not.toThrow();
  });

  it('requires verified VNPAY paid confirmation before fulfillment', () => {
    expect(() => policy.assertReadyForShipment('vnpay', 'paid', 'confirmed')).not.toThrow();
    expect(() => policy.assertReadyForShipment('vnpay', 'pending', 'new')).toThrowError(
      expect.objectContaining({ code: 'ORDER_FULFILLMENT_PAYMENT_NOT_READY' }),
    );
  });

  it('requires bounded reasons for cancellation and return', () => {
    expect(policy.normalizeReason('  Khách đổi ý  ', true)).toBe('Khách đổi ý');
    expect(() => policy.normalizeReason(' ', true)).toThrowError(
      expect.objectContaining({ code: 'ORDER_FULFILLMENT_REASON_REQUIRED' }),
    );
  });

  it('rejects timestamps that regress behind prior evidence', () => {
    expect(() =>
      policy.assertNotBefore(
        new Date('2026-08-21T05:00:00.000Z'),
        new Date('2026-08-21T06:00:00.000Z'),
        'Delivered timestamp',
      ),
    ).toThrowError(expect.objectContaining({ code: 'ORDER_FULFILLMENT_INVALID_TIMESTAMP' }));
  });
});
