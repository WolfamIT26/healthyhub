import { createHmac } from 'node:crypto';

import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment, type HealthyHubEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import * as cartEntities from '../../src/data/cart/entities';
import { CustomerProfileEntity } from '../../src/data/customer/entities';
import * as customerEntities from '../../src/data/customer/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { OrderEntity, OrderItemEntity } from '../../src/data/order/entities';
import * as orderEntities from '../../src/data/order/entities';
import { TypeOrmOrderRepository } from '../../src/data/order/repositories';
import { PaymentAttemptEntity, PaymentEntity, PaymentProviderEventEntity } from '../../src/data/payment/entities';
import * as paymentEntities from '../../src/data/payment/entities';
import { TypeOrmPaymentProviderEventRepository } from '../../src/data/payment/repositories';
import * as productEntities from '../../src/data/product/entities';
import { ShipmentEntity, ShippingAddressEntity } from '../../src/data/shipping/entities';
import * as shippingEntities from '../../src/data/shipping/entities';
import { UserAccountEntity } from '../../src/data/user/entities';
import * as userEntities from '../../src/data/user/entities';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';
import { CustomerOwnerResolver } from '../../src/domain/commerce-dependencies/customer-owner.resolver';
import { OrderPaymentMappingPolicy } from '../../src/domain/payment/order-payment-mapping.policy';
import { PaymentLifecyclePolicy } from '../../src/domain/payment/payment-lifecycle.policy';
import { PaymentMethodReader } from '../../src/domain/payment/payment-method.reader';
import { PaymentProviderRegistry } from '../../src/domain/payment/payment-provider.registry';
import { VnpayPaymentGateway } from '../../src/gateways/payment/vnpay-payment.gateway';
import { PaymentService } from '../../src/presentation/payment/payment.service';

const enabled = process.env.VNPAY_PAYMENT_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('VNPAY Payment MySQL integration', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    const databaseEnvironment = getValidatedEnvironment({
      ...process.env,
      PAYMENT_PROVIDER: 'not_configured',
    });
    dataSource = new DataSource({
      ...createTypeOrmOptions(databaseEnvironment),
      migrations: [],
      entities: [
        ...Object.values(authenticationEntities),
        ...Object.values(cartEntities),
        ...Object.values(customerEntities),
        ...Object.values(inventoryEntities),
        ...Object.values(orderEntities),
        ...Object.values(paymentEntities),
        ...Object.values(productEntities),
        ...Object.values(shippingEntities),
        ...Object.values(userEntities),
      ],
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('keeps Return non-authoritative and commits verified IPN exactly once across the persisted aggregate', async () => {
    const suffix = `${Date.now()}${Math.random().toString(16).slice(2)}`;
    const users = dataSource.getRepository(UserAccountEntity);
    const customers = dataSource.getRepository(CustomerProfileEntity);
    const orders = dataSource.getRepository(OrderEntity);
    const orderItems = dataSource.getRepository(OrderItemEntity);
    const payments = dataSource.getRepository(PaymentEntity);
    const attempts = dataSource.getRepository(PaymentAttemptEntity);
    const shipments = dataSource.getRepository(ShipmentEntity);
    const addresses = dataSource.getRepository(ShippingAddressEntity);
    const events = dataSource.getRepository(PaymentProviderEventEntity);
    const user = await users.save(users.create({
      email: `vnpay-${suffix}@example.test`,
      normalizedEmail: `vnpay-${suffix}@example.test`,
      phone: null,
      displayName: 'VNPAY Integration Fixture',
      passwordHash: 'integration-fixture-not-a-login-secret',
      userStatus: 'active',
      emailVerifiedAt: new Date(),
      lockedUntil: null,
      lastLoginAt: null,
    }));
    const customer = await customers.save(customers.create({
      tenantId: '1',
      userAccountId: user.id,
      customerCode: `CUS-VNP-${suffix}`,
      fullName: user.displayName,
      contactInfo: { email: user.email },
      customerStatus: 'active',
      consentState: 'unknown',
      marketingOptInStatus: 'not_opted_in',
    }));
    const orderRepository = new TypeOrmOrderRepository(dataSource);
    const vnpayAggregate = await orderRepository.createSnapshot({
      customerProfileId: customer.id,
      cartId: null,
      orderCode: `HHVNP${suffix}`.slice(0, 64),
      orderTotal: '125000.00',
      idempotencyKeyHash: createHashFixture(`vnpay-key-${suffix}`),
      requestHash: createHashFixture(`vnpay-request-${suffix}`),
      actorUserAccountId: user.id,
      items: [{
        productId: null,
        productName: 'VNPAY Snapshot Product',
        sku: `VNP${suffix}`.slice(0, 64),
        unitPrice: '125000.00',
        quantity: 1,
        lineTotal: '125000.00',
      }],
      payment: { method: 'vnpay', amount: '125000.00', status: 'pending' },
      shipping: {
        method: 'manual',
        fee: '0.00',
        address: {
          recipientName: 'Nguyễn Văn VNPAY',
          phone: '0901234567',
          addressText: JSON.stringify({
            countryCode: 'VN',
            provinceCity: 'Hồ Chí Minh',
            district: 'Quận 1',
            addressLine: '12 Nguyễn Huệ',
          }),
          note: 'VNPAY integration snapshot',
        },
      },
    });
    const codAggregate = await orderRepository.createSnapshot({
      customerProfileId: customer.id,
      cartId: null,
      orderCode: `HHCOD${suffix}`.slice(0, 64),
      orderTotal: '50000.00',
      idempotencyKeyHash: createHashFixture(`cod-key-${suffix}`),
      requestHash: createHashFixture(`cod-request-${suffix}`),
      actorUserAccountId: user.id,
      items: [{
        productId: null,
        productName: 'COD Regression Product',
        sku: null,
        unitPrice: '50000.00',
        quantity: 1,
        lineTotal: '50000.00',
      }],
      payment: { method: 'cod', amount: '50000.00', status: 'pending' },
      shipping: {
        method: 'manual',
        fee: '0.00',
        address: {
          recipientName: 'Nguyễn Văn COD',
          phone: '0901234567',
          addressText: JSON.stringify({ countryCode: 'VN', addressLine: '12 Nguyễn Huệ' }),
          note: null,
        },
      },
    });
    const paymentEnvironment = createPaymentEnvironment(
      getValidatedEnvironment({ ...process.env, PAYMENT_PROVIDER: 'not_configured' }),
    );
    const gateway = new VnpayPaymentGateway(paymentEnvironment);
    const providerEvents = new TypeOrmPaymentProviderEventRepository(dataSource);
    const ownerResolver = new CustomerOwnerResolver({
      findActiveByUserAccountId: (userAccountId) =>
        customers.findOneBy({ userAccountId, customerStatus: 'active' }),
    });
    const service = new PaymentService(
      paymentEnvironment,
      dataSource,
      ownerResolver,
      new PaymentMethodReader(),
      new PaymentProviderRegistry([gateway]),
      new PaymentLifecyclePolicy(),
      new OrderPaymentMappingPolicy(),
      providerEvents,
    );
    const actor = authentication(user.id);
    const createdOrderIds = [vnpayAggregate.order.id, codAggregate.order.id];
    let createdProviderReference: string | null = null;

    try {
      const intent = await service.createIntent(
        actor,
        `payment-attempt-${suffix}`,
        { orderId: vnpayAggregate.order.id, paymentMethod: 'vnpay' },
        '127.0.0.1',
      );
      const redirectUrl = new URL(intent.redirectUrl ?? '');
      expect(redirectUrl.searchParams.get('vnp_Amount')).toBe('12500000');
      expect(redirectUrl.searchParams.get('vnp_TxnRef')).toMatch(/^[A-Za-z0-9]{1,100}$/);

      const persistedAttempt = await attempts.findOneByOrFail({ paymentId: vnpayAggregate.payment.id });
      createdProviderReference = persistedAttempt.providerReference;
      const paidSignal = signedVnpayQuery({
        vnp_TmnCode: paymentEnvironment.payment.vnpay.tmnCode,
        vnp_TxnRef: persistedAttempt.providerReference,
        vnp_Amount: '12500000',
        vnp_OrderInfo: 'Thanh toan don hang HealthyHub',
        vnp_ResponseCode: '00',
        vnp_TransactionStatus: '00',
        vnp_TransactionNo: '222222222',
        vnp_PayDate: '20260812120000',
      }, paymentEnvironment.payment.vnpay.hashSecret);

      await expect(
        service.processVnpayIpn({ ...paidSignal, vnp_SecureHash: '00' }),
      ).rejects.toMatchObject({ response: { code: 'PAYMENT_SIGNATURE_INVALID' } });

      const browserResult = await service.processVnpayReturn(actor, {
        paymentId: vnpayAggregate.payment.id,
        ...paidSignal,
      });
      expect(browserResult.status).toBe('pending');
      expect(await events.countBy({ providerReference: persistedAttempt.providerReference })).toBe(0);
      expect(await payments.findOneByOrFail({ id: vnpayAggregate.payment.id })).toMatchObject({
        paymentStatus: 'pending',
        paidAt: null,
      });
      expect(await orders.findOneByOrFail({ id: vnpayAggregate.order.id })).toMatchObject({
        orderStatus: 'new',
        paymentStatusSnapshot: 'pending',
      });

      const mismatchedSignal = signedVnpayQuery({
        ...Object.fromEntries(Object.entries(paidSignal).filter(([key]) => key !== 'vnp_SecureHash')),
        vnp_Amount: '12499900',
        vnp_TransactionNo: '111111111',
      }, paymentEnvironment.payment.vnpay.hashSecret);
      await expect(service.processVnpayIpn(mismatchedSignal)).rejects.toMatchObject({
        response: { code: 'PAYMENT_AMOUNT_MISMATCH' },
      });
      expect(await payments.findOneByOrFail({ id: vnpayAggregate.payment.id })).toMatchObject({
        paymentStatus: 'pending',
        paidAt: null,
      });

      await expect(service.processVnpayIpn(paidSignal)).resolves.toEqual({
        rspCode: '00',
        message: 'Confirm Success',
      });
      await expect(service.processVnpayIpn(paidSignal)).resolves.toEqual({
        rspCode: '00',
        message: 'Confirm Success',
      });

      expect(await service.getStatus(actor, vnpayAggregate.payment.id)).toMatchObject({
        status: 'paid',
        amount: '125000.00',
        providerReference: persistedAttempt.providerReference,
      });
      expect(await orders.findOneByOrFail({ id: vnpayAggregate.order.id })).toMatchObject({
        orderStatus: 'confirmed',
        paymentStatusSnapshot: 'paid',
        orderTotal: '125000.00',
      });
      expect(await orderItems.findOneByOrFail({ orderId: vnpayAggregate.order.id })).toMatchObject({
        productNameSnapshot: 'VNPAY Snapshot Product',
        unitPriceSnapshot: '125000.00',
        quantity: 1,
        lineTotal: '125000.00',
      });
      expect(await payments.findOneByOrFail({ id: vnpayAggregate.payment.id })).toMatchObject({
        paymentMethod: 'vnpay',
        paymentAmount: '125000.00',
        paymentStatus: 'paid',
        providerReference: persistedAttempt.providerReference,
      });
      expect(await attempts.findOneByOrFail({ id: persistedAttempt.id })).toMatchObject({
        amount: '125000.00',
        currency: 'VND',
        attemptStatus: 'paid',
        providerTransactionNo: '222222222',
      });
      const shipment = await shipments.findOneByOrFail({ orderId: vnpayAggregate.order.id });
      expect(shipment).toMatchObject({ shippingFee: '0.00', shippingStatus: 'pending' });
      const address = await addresses.findOneByOrFail({ shipmentId: shipment.id });
      expect(address).toMatchObject({
        recipientName: 'Nguyễn Văn VNPAY',
        recipientPhone: '0901234567',
        deliveryNote: 'VNPAY integration snapshot',
      });
      expect(JSON.parse(address.addressText)).toMatchObject({
        countryCode: 'VN',
        addressLine: '12 Nguyễn Huệ',
      });

      const providerEventRows = await events.find({
        where: { providerReference: persistedAttempt.providerReference },
        order: { id: 'ASC' },
      });
      expect(providerEventRows).toHaveLength(2);
      expect(providerEventRows.map((event) => event.processingStatus).sort()).toEqual(['failed', 'processed']);
      expect(providerEventRows.find((event) => event.processingStatus === 'failed')).toMatchObject({
        failureCode: 'PAYMENT_AMOUNT_MISMATCH',
        paymentId: null,
      });
      expect(providerEventRows.find((event) => event.processingStatus === 'processed')).toMatchObject({
        paymentId: vnpayAggregate.payment.id,
        failureCode: null,
      });
      expect(providerEventRows.every((event) => /^[a-f0-9]{64}$/.test(event.payloadHash))).toBe(true);

      expect(await payments.findOneByOrFail({ id: codAggregate.payment.id })).toMatchObject({
        paymentMethod: 'cod',
        paymentAmount: '50000.00',
        paymentStatus: 'pending',
        paidAt: null,
        providerReference: null,
      });
      expect(await orders.findOneByOrFail({ id: codAggregate.order.id })).toMatchObject({
        orderStatus: 'new',
        paymentStatusSnapshot: 'pending',
      });
      expect(await attempts.countBy({ paymentId: codAggregate.payment.id })).toBe(0);
    } finally {
      if (createdProviderReference) await events.delete({ providerReference: createdProviderReference });
      await attempts.delete({ paymentId: vnpayAggregate.payment.id });
      for (const orderId of createdOrderIds) {
        const shipment = await shipments.findOneBy({ orderId });
        if (shipment) await addresses.delete({ shipmentId: shipment.id });
        await shipments.delete({ orderId });
        await payments.delete({ orderId });
        await orderItems.delete({ orderId });
        await orders.delete(orderId);
      }
      await customers.delete(customer.id);
      await users.delete(user.id);
    }
  });
});

function authentication(userAccountId: string) {
  return {
    userAccountId,
    sessionId: '1',
    sessionPublicId: `session-${userAccountId}`,
    roles: ['CUSTOMER'] as const,
    permissionsVersion: 1,
  };
}

function createPaymentEnvironment(base: HealthyHubEnvironment): HealthyHubEnvironment {
  return {
    ...base,
    payment: {
      provider: 'vnpay',
      vnpay: {
        tmnCode: 'TESTTMN1',
        hashSecret: 'integration-test-only-signing-key',
        paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
        apiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
        returnUrl: 'http://localhost:3000/payment/vnpay/return',
        ipnUrl: 'https://merchant.example.test/api/v1/webhooks/payment/vnpay',
      },
    },
  };
}

function signedVnpayQuery(values: Record<string, string>, hashSecret: string): Record<string, string> {
  const ordered = Object.entries(values).sort(([left], [right]) => left.localeCompare(right));
  const canonical = new URLSearchParams(ordered).toString();
  return {
    ...values,
    vnp_SecureHash: createHmac('sha512', hashSecret).update(canonical).digest('hex'),
  };
}

function createHashFixture(value: string): string {
  return createHmac('sha256', 'integration-fixture-key').update(value).digest('hex');
}
