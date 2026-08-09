import { describe, expect, it } from 'vitest';
import { InvalidPaymentTransitionError, PaymentLifecyclePolicy } from './payment-lifecycle.policy';

describe('PaymentLifecyclePolicy', () => {
  const policy = new PaymentLifecyclePolicy();
  it('allows progress, idempotent retry and verified late success after failure', () => {
    expect(policy.assertTransition('pending', 'paid')).toBe('changed');
    expect(policy.assertTransition('paid', 'paid')).toBe('idempotent');
    expect(policy.assertTransition('failed', 'paid')).toBe('changed');
  });
  it('prevents regression and delayed success after cancellation', () => {
    expect(() => policy.assertTransition('paid', 'pending')).toThrow(InvalidPaymentTransitionError);
    expect(() => policy.assertTransition('cancelled', 'paid')).toThrow(
      InvalidPaymentTransitionError,
    );
    expect(() => policy.assertTransition('refunded', 'paid')).toThrow(
      InvalidPaymentTransitionError,
    );
  });
});
