import { describe, expect, it } from 'vitest';

import { PaymentMethodReader, UnsupportedPaymentMethodError } from './payment-method.reader';

describe('PaymentMethodReader', () => {
  const reader = new PaymentMethodReader();

  it('exposes approved executable COD and VNPAY with pending status', () => {
    expect(reader.listExecutableMethods()).toEqual([
      {
        code: 'cod',
        name: 'Thanh toán khi nhận hàng',
        enabled: true,
        captureRequired: false,
        initialPaymentStatus: 'pending',
      },
      {
        code: 'vnpay',
        name: 'Thanh toán VNPAY',
        enabled: true,
        captureRequired: true,
        initialPaymentStatus: 'pending',
      },
    ]);
  });

  it.each(['online', 'bank_transfer', 'card', ''])(
    'rejects unsupported or future method %s',
    (method) => {
      expect(() => reader.requireExecutableMethod(method)).toThrow(UnsupportedPaymentMethodError);
    },
  );

  it('never marks COD paid or creates a capture result', () => {
    const method = reader.requireExecutableMethod('COD');
    expect(method.initialPaymentStatus).toBe('pending');
    expect(method.captureRequired).toBe(false);
    expect(method).not.toHaveProperty('paid');
    expect(method).not.toHaveProperty('providerReference');
  });

  it('exposes VNPAY as a redirect-based payment method', () => {
    const method = reader.requireExecutableMethod('vnpay');
    expect(method.captureRequired).toBe(true);
    expect(method.initialPaymentStatus).toBe('pending');
  });
});
