import { describe, expect, it } from 'vitest';
import { OrderPaymentMappingPolicy } from './order-payment-mapping.policy';

describe('OrderPaymentMappingPolicy', () => {
  const policy = new OrderPaymentMappingPolicy();
  it('limits Order effects to verified paid and separately approved refund workflow', () => {
    expect(policy.effectFor('pending')).toBe('none');
    expect(policy.effectFor('failed')).toBe('none');
    expect(policy.effectFor('cancelled')).toBe('none');
    expect(policy.effectFor('paid')).toBe('confirm_if_placed');
    expect(policy.effectFor('refunded')).toBe('refund_via_approved_workflow');
  });
});
