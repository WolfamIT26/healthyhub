import { describe, expect, it, vi } from 'vitest';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import type { HealthyHubEnvironment } from '../../config/environment';
import { OrderEntity } from '../../data/order/entities';
import { PaymentAttemptEntity, PaymentEntity } from '../../data/payment/entities';
import { OrderPaymentMappingPolicy } from '../../domain/payment/order-payment-mapping.policy';
import { PaymentLifecyclePolicy } from '../../domain/payment/payment-lifecycle.policy';
import { PaymentMethodReader } from '../../domain/payment/payment-method.reader';
import { PaymentService } from './payment.service';

const auth: AuthenticatedRequestContext = {
  userAccountId: 'user-1',
  sessionId: 'session-1',
  sessionPublicId: 'public-session-1',
  roles: ['CUSTOMER'],
  permissionsVersion: 1,
};

describe('PaymentService VNPAY authority', () => {
  it('verifies browser return without claiming an event or changing authoritative state', async () => {
    const fixture = createFixture();

    const result = await fixture.service.processVnpayReturn(auth, {
      paymentId: fixture.payment.id,
      vnp_TxnRef: fixture.attempt.providerReference,
    });

    expect(result.status).toBe('pending');
    expect(fixture.gateway.verifyWebhook).toHaveBeenCalledOnce();
    expect(fixture.providerEvents.claim).not.toHaveBeenCalled();
    expect(fixture.providerEvents.completeWithBusinessEffect).not.toHaveBeenCalled();
    expect(fixture.dataSource.transaction).not.toHaveBeenCalled();
  });

  it('rejects a browser return whose signed amount differs from persisted Order/Payment/attempt', async () => {
    const fixture = createFixture({ verifiedAmount: '99999.00' });

    await expect(
      fixture.service.processVnpayReturn(auth, {
        paymentId: fixture.payment.id,
        vnp_TxnRef: fixture.attempt.providerReference,
      }),
    ).rejects.toMatchObject({ response: { code: 'PAYMENT_AMOUNT_MISMATCH' } });

    expect(fixture.providerEvents.claim).not.toHaveBeenCalled();
  });

  it('creates the redirect amount from the persisted Order after cross-checking Payment', async () => {
    const fixture = createFixture();

    await fixture.service.createIntent(
      auth,
      'checkout-attempt-1',
      { orderId: fixture.order.id, paymentMethod: 'vnpay' },
      '127.0.0.1',
    );

    expect(fixture.gateway.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({ amount: fixture.order.orderTotal }),
    );
  });

  it('fails closed when persisted Order and Payment amounts disagree', async () => {
    const fixture = createFixture();
    fixture.payment.paymentAmount = '124999.00';

    await expect(
      fixture.service.createIntent(
        auth,
        'checkout-attempt-1',
        { orderId: fixture.order.id, paymentMethod: 'vnpay' },
        '127.0.0.1',
      ),
    ).rejects.toMatchObject({ response: { code: 'PAYMENT_AMOUNT_MISMATCH' } });

    expect(fixture.gateway.createPayment).not.toHaveBeenCalled();
  });
});

function createFixture(options: { verifiedAmount?: string } = {}) {
  const order = {
    id: '91',
    tenantId: '1',
    customerProfileId: 'customer-1',
    orderCode: 'HH-20260812-TEST',
    orderStatus: 'new',
    paymentStatusSnapshot: 'pending',
    orderTotal: '125000.00',
    createdAt: new Date('2026-08-12T01:00:00Z'),
    updatedAt: new Date('2026-08-12T01:00:00Z'),
  } as OrderEntity;
  const payment = {
    id: '101',
    tenantId: '1',
    orderId: order.id,
    paymentMethod: 'vnpay',
    paymentAmount: order.orderTotal,
    paymentStatus: 'pending',
    paidAt: null,
    providerReference: 'HHVNP101ABCDEF1234567890',
    createdAt: new Date('2026-08-12T01:00:00Z'),
    updatedAt: new Date('2026-08-12T01:00:00Z'),
  } as PaymentEntity;
  const attempt = {
    id: '111',
    tenantId: '1',
    paymentId: payment.id,
    provider: 'vnpay',
    providerReference: payment.providerReference,
    providerTransactionNo: null,
    amount: order.orderTotal,
    currency: 'VND',
    attemptStatus: 'pending',
    idempotencyKeyHash: 'a'.repeat(64),
    expiresAt: new Date('2026-08-12T01:15:00Z'),
    completedAt: null,
    createdAt: new Date('2026-08-12T01:00:00Z'),
    updatedAt: new Date('2026-08-12T01:00:00Z'),
  } as PaymentAttemptEntity;

  const repositories = new Map<unknown, unknown>([
    [OrderEntity, { findOneBy: vi.fn().mockResolvedValue(order) }],
    [PaymentEntity, { findOneBy: vi.fn().mockResolvedValue(payment) }],
    [
      PaymentAttemptEntity,
      {
        findOneBy: vi.fn().mockResolvedValue(attempt),
        findOne: vi.fn().mockResolvedValue(attempt),
      },
    ],
  ]);
  const dataSource = {
    getRepository: vi.fn((entity) => repositories.get(entity)),
    transaction: vi.fn(),
  };
  const gateway = {
    providerCode: 'vnpay',
    createPayment: vi.fn().mockResolvedValue({
      provider: 'vnpay',
      providerReference: attempt.providerReference,
      providerTransactionNo: null,
      status: 'pending',
      redirectUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?signed=test',
    }),
    queryPayment: vi.fn(),
    verifyWebhook: vi.fn().mockResolvedValue({
      provider: 'vnpay',
      eventId: `${attempt.providerReference}:123:00:00`,
      eventType: 'payment.notification',
      providerReference: attempt.providerReference,
      providerTransactionNo: '123',
      responseCode: '00',
      transactionStatus: '00',
      status: 'paid',
      amount: options.verifiedAmount ?? order.orderTotal,
      currency: 'VND',
      occurredAt: new Date('2026-08-12T01:05:00Z'),
      verifiedAt: new Date('2026-08-12T01:05:01Z'),
    }),
  };
  const providerEvents = {
    claim: vi.fn(),
    completeWithBusinessEffect: vi.fn(),
    markFailed: vi.fn(),
    markRejected: vi.fn(),
    findByProviderEvent: vi.fn(),
  };
  const stockMutations = {
    consumeForOrder: vi.fn(),
    releaseForOrder: vi.fn(),
    restockForOrder: vi.fn(),
  };
  const service = new PaymentService(
    environment,
    dataSource as never,
    { resolve: vi.fn().mockResolvedValue({ customerProfileId: order.customerProfileId }) } as never,
    new PaymentMethodReader(),
    {
      getDecision: vi.fn().mockReturnValue({ gatewayConfigured: true }),
      resolve: vi.fn().mockReturnValue(gateway),
    } as never,
    new PaymentLifecyclePolicy(),
    new OrderPaymentMappingPolicy(),
    providerEvents as never,
    stockMutations as never,
  );

  return {
    service,
    dataSource,
    gateway,
    providerEvents,
    stockMutations,
    order,
    payment,
    attempt,
  };
}

const environment = {
  payment: {
    provider: 'vnpay',
    vnpay: {
      tmnCode: 'TESTTMN1',
      hashSecret: 'unit-test-only-key',
      paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      apiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
      returnUrl: 'http://localhost:3000/payment/vnpay/return',
      ipnUrl: 'https://merchant.example.test/api/v1/webhooks/payment/vnpay',
    },
  },
} as HealthyHubEnvironment;
