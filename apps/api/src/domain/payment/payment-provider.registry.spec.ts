import { describe, expect, it, vi } from 'vitest';

import type { PaymentProviderGateway } from './payment-provider.gateway';
import { PaymentProviderNotConfiguredError } from './payment-provider.gateway';
import { PaymentProviderRegistry } from './payment-provider.registry';

describe('PaymentProviderRegistry', () => {
  it('exposes no configured online provider and rejects unsupported selection', () => {
    const registry = new PaymentProviderRegistry([]);
    expect(registry.listConfiguredProviders()).toEqual([]);
    expect(() => registry.resolve('vnpay')).toThrow(PaymentProviderNotConfiguredError);
  });

  it('defines an adapter contract without producing fake provider success', async () => {
    const gateway: PaymentProviderGateway = {
      providerCode: 'test-double',
      createPayment: vi.fn().mockRejectedValue(new Error('provider unavailable')),
      queryPayment: vi.fn().mockRejectedValue(new Error('provider unavailable')),
      verifyWebhook: vi.fn().mockRejectedValue(new Error('invalid signature')),
    };
    await expect(
      gateway.createPayment({
        paymentId: '1',
        orderId: '2',
        amount: '100000.00',
        currency: 'VND',
        idempotencyKey: 'attempt-001',
        returnUrl: 'https://example.test/return',
        cancelUrl: 'https://example.test/cancel',
      }),
    ).rejects.toThrow('provider unavailable');
    await expect(gateway.verifyWebhook(Buffer.from('{}'), {})).rejects.toThrow('invalid signature');
  });
});
