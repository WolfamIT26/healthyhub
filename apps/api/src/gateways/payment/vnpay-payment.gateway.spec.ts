import { createHmac } from 'node:crypto';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { HealthyHubEnvironment } from '../../config/environment';
import { VnpayPaymentGateway, VnpayPaymentSignatureError } from './vnpay-payment.gateway';

const env = {
  payment: {
    provider: 'vnpay',
    vnpay: {
      tmnCode: 'TMN123',
      hashSecret: 'secret-key',
      paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      apiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
      returnUrl: 'http://localhost:3000/payment/vnpay/return',
      ipnUrl: 'http://localhost:3001/api/v1/webhooks/payment/vnpay',
    },
  },
} as HealthyHubEnvironment;

describe('VnpayPaymentGateway', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates a signed payment URL with amount converted to VNPAY minor units', async () => {
    const gateway = new VnpayPaymentGateway(env);
    const result = await gateway.createPayment({
      paymentId: '1',
      orderId: '11',
      providerReference: 'HHVNP-1-test',
      amount: '1234.50',
      currency: 'VND',
      idempotencyKey: 'attempt-001',
      returnUrl: 'http://localhost:3000/payment/vnpay/return?paymentId=1',
      cancelUrl: 'http://localhost:3000/payment/vnpay/return?paymentId=1',
      createdAt: new Date('2026-08-10T00:00:00+07:00'),
      expiresAt: new Date('2026-08-10T00:15:00+07:00'),
      orderInfo: 'Thanh toán đơn HH-1',
      ipAddress: '127.0.0.1',
    });

    const url = new URL(result.redirectUrl ?? '');
    expect(url.searchParams.get('vnp_Amount')).toBe('123450');
    expect(url.searchParams.get('vnp_TxnRef')).toBe('HHVNP-1-test');
    expect(url.searchParams.get('vnp_OrderInfo')).toBe('Thanh toan don HH 1');
    expect(url.searchParams.has('vnp_SecureHashType')).toBe(false);
    expect(url.searchParams.get('vnp_SecureHash')).toBe(
      signQuery(url.searchParams, env.payment.vnpay.hashSecret),
    );
  });

  it('verifies a provider callback and normalizes the payment result', async () => {
    const gateway = new VnpayPaymentGateway(env);
    const query = buildQuery(
      {
        vnp_TmnCode: env.payment.vnpay.tmnCode,
        vnp_TxnRef: 'HHVNP-1-test',
        vnp_Amount: '123450',
        vnp_ResponseCode: '00',
        vnp_TransactionStatus: '00',
        vnp_TransactionNo: '987654321',
        vnp_PayDate: '20260810093045',
      },
      env.payment.vnpay.hashSecret,
    );

    const result = await gateway.verifyWebhook(Buffer.alloc(0), {}, query);

    expect(result.providerReference).toBe('HHVNP-1-test');
    expect(result.providerTransactionNo).toBe('987654321');
    expect(result.amount).toBe('1234.50');
    expect(result.status).toBe('paid');
  });

  it('rejects invalid webhook signatures', async () => {
    const gateway = new VnpayPaymentGateway(env);
    await expect(
      gateway.verifyWebhook(
        Buffer.alloc(0),
        {},
        {
          vnp_TxnRef: 'HHVNP-1-test',
          vnp_Amount: '123450',
          vnp_ResponseCode: '00',
          vnp_SecureHash: 'deadbeef',
        },
      ),
    ).rejects.toBeInstanceOf(VnpayPaymentSignatureError);
  });

  it.each([
    ['51', '02', 'failed'],
    ['24', '02', 'cancelled'],
    ['00', '01', 'pending'],
  ] as const)(
    'maps response %s / transaction %s to %s',
    async (responseCode, transactionStatus, status) => {
      const gateway = new VnpayPaymentGateway(env);
      const query = buildQuery(
        {
          vnp_TmnCode: env.payment.vnpay.tmnCode,
          vnp_TxnRef: `HHVNP-${responseCode}-${transactionStatus}`,
          vnp_Amount: '123450',
          vnp_ResponseCode: responseCode,
          vnp_TransactionStatus: transactionStatus,
          vnp_TransactionNo: '987654321',
        },
        env.payment.vnpay.hashSecret,
      );

      await expect(gateway.verifyWebhook(Buffer.alloc(0), {}, query)).resolves.toMatchObject({
        status,
      });
    },
  );

  it('rejects a signed callback for another terminal', async () => {
    const gateway = new VnpayPaymentGateway(env);
    const query = buildQuery(
      {
        vnp_TmnCode: 'OTHER001',
        vnp_TxnRef: 'HHVNP-1-test',
        vnp_Amount: '123450',
        vnp_ResponseCode: '00',
        vnp_TransactionStatus: '00',
        vnp_TransactionNo: '987654321',
      },
      env.payment.vnpay.hashSecret,
    );

    await expect(gateway.verifyWebhook(Buffer.alloc(0), {}, query)).rejects.toThrow(
      'VNPAY trả về sai terminal.',
    );
  });

  it('queries provider status through the official reconciliation endpoint', async () => {
    const gateway = new VnpayPaymentGateway(env);
    const queryResponse = buildQueryDrResponse(
      {
        vnp_ResponseId: 'QDR-001',
        vnp_Command: 'querydr',
        vnp_ResponseCode: '00',
        vnp_Message: 'Success',
        vnp_TmnCode: env.payment.vnpay.tmnCode,
        vnp_TxnRef: 'HHVNP-1-test',
        vnp_Amount: '123450',
        vnp_BankCode: 'NCB',
        vnp_PayDate: '20260810093045',
        vnp_TransactionNo: '987654321',
        vnp_TransactionType: '01',
        vnp_TransactionStatus: '00',
        vnp_OrderInfo: 'HealthyHub order HHVNP-1-test',
      },
      env.payment.vnpay.hashSecret,
    );
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => queryResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await gateway.queryPayment(
      'HHVNP-1-test',
      new Date('2026-08-10T00:00:00+07:00'),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      env.payment.vnpay.apiUrl,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    );
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body as string) as Record<
      string,
      string
    >;
    expect(requestBody.vnp_Command).toBe('querydr');
    expect(requestBody.vnp_SecureHash).toBe(
      signPipe(
        [
          requestBody.vnp_RequestId,
          requestBody.vnp_Version,
          requestBody.vnp_Command,
          requestBody.vnp_TmnCode,
          requestBody.vnp_TxnRef,
          requestBody.vnp_TransactionDate,
          requestBody.vnp_CreateDate,
          requestBody.vnp_IpAddr,
          requestBody.vnp_OrderInfo,
        ],
        env.payment.vnpay.hashSecret,
      ),
    );
    expect(result.status).toBe('paid');
    expect(result.amount).toBe('1234.50');
    expect(result.providerTransactionNo).toBe('987654321');
  });

  it('rejects query responses with invalid provider checksum', async () => {
    const gateway = new VnpayPaymentGateway(env);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          vnp_ResponseId: 'QDR-001',
          vnp_Command: 'querydr',
          vnp_ResponseCode: '00',
          vnp_Message: 'Success',
          vnp_TmnCode: env.payment.vnpay.tmnCode,
          vnp_TxnRef: 'HHVNP-1-test',
          vnp_Amount: '123450',
          vnp_BankCode: 'NCB',
          vnp_PayDate: '20260810093045',
          vnp_TransactionNo: '987654321',
          vnp_TransactionType: '01',
          vnp_TransactionStatus: '00',
          vnp_OrderInfo: 'HealthyHub order HHVNP-1-test',
          vnp_SecureHash: 'deadbeef',
        }),
      }),
    );

    await expect(
      gateway.queryPayment('HHVNP-1-test', new Date('2026-08-10T00:00:00+07:00')),
    ).rejects.toBeInstanceOf(VnpayPaymentSignatureError);
  });
});

function buildQuery(values: Record<string, string>, hashSecret: string) {
  const params = { ...values };
  const secureHash = signQuery(new URLSearchParams(params), hashSecret);
  return {
    ...Object.fromEntries(Object.entries(params).map(([key, value]) => [key, value])),
    vnp_SecureHash: secureHash,
  };
}

function signQuery(params: URLSearchParams, hashSecret: string): string {
  const canonical = new URLSearchParams(
    [...params.entries()]
      .filter(([key]) => key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType')
      .sort(([left], [right]) => left.localeCompare(right)),
  ).toString();
  return createHmac('sha512', hashSecret).update(canonical).digest('hex');
}

function buildQueryDrResponse(
  values: Record<string, string>,
  hashSecret: string,
): Record<string, string> {
  return {
    ...values,
    vnp_SecureHash: signPipe(
      [
        values.vnp_ResponseId,
        values.vnp_Command,
        values.vnp_ResponseCode,
        values.vnp_Message,
        values.vnp_TmnCode,
        values.vnp_TxnRef,
        values.vnp_Amount,
        values.vnp_BankCode,
        values.vnp_PayDate,
        values.vnp_TransactionNo,
        values.vnp_TransactionType,
        values.vnp_TransactionStatus,
        values.vnp_OrderInfo,
        values.vnp_PromotionCode,
        values.vnp_PromotionAmount,
      ],
      hashSecret,
    ),
  };
}

function signPipe(values: Array<string | undefined>, hashSecret: string): string {
  return createHmac('sha512', hashSecret)
    .update(values.map((value) => value ?? '').join('|'))
    .digest('hex');
}
