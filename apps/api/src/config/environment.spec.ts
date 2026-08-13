import { describe, expect, it } from 'vitest';

import { getValidatedEnvironment, validateEnvironmentSource } from './environment';

const base = {
  APP_ENV: 'test',
  API_PORT: '3001',
  AUTH_JWT_SECRET: 'test-jwt-secret-at-least-thirty-two-characters',
  AUTH_CSRF_SECRET: 'test-csrf-secret-at-least-thirty-two-characters',
  AUTH_IDENTIFIER_HMAC_SECRET: 'test-hmac-secret-at-least-thirty-two-characters',
  MYSQL_HOST: 'localhost',
  MYSQL_DATABASE: 'healthyhub_test',
  MYSQL_USER: 'healthyhub',
  MYSQL_PASSWORD: 'test-password',
};

describe('application environment', () => {
  it('uses API_PORT as the API listener authority', () => {
    const env = getValidatedEnvironment({ ...base, API_PORT: '4312' });

    expect(env.app.port).toBe(4312);
  });

  it('rejects an invalid API_PORT', () => {
    expect(() => getValidatedEnvironment({ ...base, API_PORT: '70000' })).toThrow(
      'API_PORT phải nhỏ hơn hoặc bằng 65535',
    );
  });

  it('requires API_PORT instead of using a source-code listener fallback', () => {
    expect(() => getValidatedEnvironment({ ...base, API_PORT: undefined })).toThrow(
      'API_PORT là biến môi trường bắt buộc',
    );
  });

  it('preserves validated raw keys for ConfigModule process environment loading', () => {
    const source = { ...base, API_PORT: '3001' };

    expect(validateEnvironmentSource(source)).toBe(source);
  });
});

describe('payment environment', () => {
  it('fails closed when VNPAY is selected without complete credentials and endpoints', () => {
    expect(() => getValidatedEnvironment({ ...base, PAYMENT_PROVIDER: 'vnpay' })).toThrow(
      'Thiếu cấu hình VNPAY',
    );
  });

  it('accepts the approved VNPAY configuration boundary', () => {
    const env = getValidatedEnvironment({
      ...base,
      PAYMENT_PROVIDER: 'vnpay',
      VNPAY_TMN_CODE: 'terminal',
      VNPAY_HASH_SECRET: 'secret',
      VNPAY_PAYMENT_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      VNPAY_API_URL: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
      VNPAY_RETURN_URL: 'https://example.test/payment/return',
      VNPAY_IPN_URL: 'https://api.example.test/webhooks/vnpay',
    });
    expect(env.payment.provider).toBe('vnpay');
  });

  it('rejects a non-HTTPS VNPAY IPN callback', () => {
    expect(() =>
      getValidatedEnvironment({
        ...base,
        PAYMENT_PROVIDER: 'vnpay',
        VNPAY_TMN_CODE: 'TESTTMN1',
        VNPAY_HASH_SECRET: 'test-only-key',
        VNPAY_PAYMENT_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
        VNPAY_API_URL: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
        VNPAY_RETURN_URL: 'http://localhost:3000/payment/vnpay/return',
        VNPAY_IPN_URL: 'http://localhost:3001/api/v1/webhooks/payment/vnpay',
      }),
    ).toThrow('VNPAY_IPN_URL phải là HTTPS public callback');
  });
});
