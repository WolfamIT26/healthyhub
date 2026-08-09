import { describe, expect, it } from 'vitest';
import { webhookMatchesPayment } from './payment-webhook.contract';

const event = {
  provider: 'provider',
  eventId: 'evt-1',
  eventType: 'payment.success',
  providerReference: 'txn-1',
  status: 'paid' as const,
  amount: '100000.00',
  currency: 'VND' as const,
  occurredAt: new Date(),
  verifiedAt: new Date(),
};
describe('provider-neutral webhook matching', () => {
  it('requires reference, authoritative amount and currency to match', () => {
    const payment = {
      paymentId: '1',
      providerReference: 'txn-1',
      amount: '100000.00',
      currency: 'VND' as const,
      status: 'pending' as const,
    };
    expect(webhookMatchesPayment(event, payment)).toBe(true);
    expect(webhookMatchesPayment({ ...event, amount: '99999.00' }, payment)).toBe(false);
    expect(webhookMatchesPayment({ ...event, providerReference: 'txn-other' }, payment)).toBe(
      false,
    );
  });
});
