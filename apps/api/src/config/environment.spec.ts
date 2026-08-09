import { describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from './environment';

const base = {
  APP_ENV: 'test',
  AUTH_JWT_SECRET: 'test-jwt-secret-at-least-thirty-two-characters',
  AUTH_CSRF_SECRET: 'test-csrf-secret-at-least-thirty-two-characters',
  AUTH_IDENTIFIER_HMAC_SECRET: 'test-hmac-secret-at-least-thirty-two-characters',
  MYSQL_HOST: 'localhost', MYSQL_DATABASE: 'healthyhub_test', MYSQL_USER: 'healthyhub', MYSQL_PASSWORD: 'test-password',
};

describe('payment environment', () => {
  it('fails closed when VNPAY is selected without complete credentials and endpoints', () => {
    expect(() => getValidatedEnvironment({ ...base, PAYMENT_PROVIDER: 'vnpay' })).toThrow('Thiếu cấu hình VNPAY');
  });

  it('accepts the approved VNPAY configuration boundary', () => {
    const env = getValidatedEnvironment({
      ...base, PAYMENT_PROVIDER: 'vnpay', VNPAY_TMN_CODE: 'terminal', VNPAY_HASH_SECRET: 'secret',
      VNPAY_PAYMENT_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      VNPAY_API_URL: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
      VNPAY_RETURN_URL: 'https://example.test/payment/return', VNPAY_IPN_URL: 'https://api.example.test/webhooks/vnpay',
    });
    expect(env.payment.provider).toBe('vnpay');
  });
});
