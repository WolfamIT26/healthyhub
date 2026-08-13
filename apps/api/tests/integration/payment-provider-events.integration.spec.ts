import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import * as cartEntities from '../../src/data/cart/entities';
import { CustomerProfileEntity } from '../../src/data/customer/entities';
import * as customerEntities from '../../src/data/customer/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { OrderEntity } from '../../src/data/order/entities';
import * as orderEntities from '../../src/data/order/entities';
import { PaymentEntity, PaymentProviderEventEntity } from '../../src/data/payment/entities';
import * as paymentEntities from '../../src/data/payment/entities';
import { TypeOrmPaymentProviderEventRepository } from '../../src/data/payment/repositories';
import * as productEntities from '../../src/data/product/entities';
import * as shippingEntities from '../../src/data/shipping/entities';
import { UserAccountEntity } from '../../src/data/user/entities';
import * as userEntities from '../../src/data/user/entities';
import { CreateUserIdentityFoundation1760000000000 } from '../../src/database/migrations/1760000000000-create-user-identity-foundation';
import { CreateAuthenticationData1760000001000 } from '../../src/database/migrations/1760000001000-create-authentication-data';
import { CreateCartDependencyFoundation1760000002000 } from '../../src/database/migrations/1760000002000-create-cart-dependency-foundation';
import { CreateCartPersistence1760000003000 } from '../../src/database/migrations/1760000003000-create-cart-persistence';
import { CreateOrderCreationFoundation1760000004000 } from '../../src/database/migrations/1760000004000-create-order-creation-foundation';
import { CreatePaymentProviderEvents1760000005000 } from '../../src/database/migrations/1760000005000-create-payment-provider-events';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';

const enabled = process.env.PAYMENT_EVENT_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Payment provider event MySQL integration', () => {
  let dataSource: DataSource;
  beforeAll(async () => {
    dataSource = new DataSource({
      ...createTypeOrmOptions(getValidatedEnvironment({ ...process.env, PAYMENT_PROVIDER: 'not_configured' })),
      migrations: [CreateUserIdentityFoundation1760000000000, CreateAuthenticationData1760000001000,
        CreateCartDependencyFoundation1760000002000, CreateCartPersistence1760000003000,
        CreateOrderCreationFoundation1760000004000, CreatePaymentProviderEvents1760000005000],
      entities: [...Object.values(authenticationEntities), ...Object.values(cartEntities), ...Object.values(customerEntities),
        ...Object.values(inventoryEntities), ...Object.values(orderEntities), ...Object.values(paymentEntities),
        ...Object.values(productEntities), ...Object.values(shippingEntities), ...Object.values(userEntities)],
    });
    await dataSource.initialize();
  });
  afterAll(async () => { if (dataSource?.isInitialized) await dataSource.destroy(); });

  it('deduplicates concurrent delivery, commits once, supports failed retry, rejection and reload', async () => {
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const userRepo = dataSource.getRepository(UserAccountEntity);
    const customerRepo = dataSource.getRepository(CustomerProfileEntity);
    const orderRepo = dataSource.getRepository(OrderEntity);
    const paymentRepo = dataSource.getRepository(PaymentEntity);
    const eventRepo = dataSource.getRepository(PaymentProviderEventEntity);
    const user = await userRepo.save(userRepo.create({ email: `payment-${suffix}@example.test`, normalizedEmail: `payment-${suffix}@example.test`,
      phone: null, displayName: 'Payment Fixture', passwordHash: 'integration-fixture-not-login-secret', userStatus: 'active',
      emailVerifiedAt: new Date(), lockedUntil: null, lastLoginAt: null }));
    const customer = await customerRepo.save(customerRepo.create({ tenantId: '1', userAccountId: user.id,
      customerCode: `CUS-PAY-${suffix}`, fullName: user.displayName, contactInfo: { email: user.email }, customerStatus: 'active',
      consentState: 'unknown', marketingOptInStatus: 'not_opted_in' }));
    const order = await orderRepo.save(orderRepo.create({ tenantId: '1', customerProfileId: customer.id, cartId: null,
      orderCode: `PAY-${suffix}`, orderSource: 'web', orderStatus: 'new', paymentStatusSnapshot: 'pending',
      shippingStatusSnapshot: 'pending', orderTotal: '100000.00', idempotencyKeyHash: 'a'.repeat(64), requestHash: 'b'.repeat(64),
      placedAt: new Date(), completedAt: null }));
    const payment = await paymentRepo.save(paymentRepo.create({ tenantId: '1', orderId: order.id, paymentMethod: 'cod',
      paymentAmount: '100000.00', paymentStatus: 'pending', paidAt: null, providerReference: null }));
    const repository = new TypeOrmPaymentProviderEventRepository(dataSource);
    const input = { provider: 'vnpay', providerEventId: `event-${suffix}`, eventType: 'payment.result',
      providerReference: `ref-${suffix}`, payloadHash: 'c'.repeat(64), receivedAt: new Date() };
    try {
      const claims = await Promise.all([repository.claim(input), repository.claim(input)]);
      expect(claims.filter((claim) => claim.claimed)).toHaveLength(1);
      const claimed = claims.find((claim) => claim.claimed)!;
      let effects = 0;
      await repository.completeWithBusinessEffect(claimed.event.id, payment.id, async (manager) => {
        effects += 1;
        await manager.getRepository(PaymentEntity).update(payment.id, { providerReference: input.providerReference });
      });
      expect(effects).toBe(1);
      expect((await repository.claim(input)).claimed).toBe(false);
      expect((await new TypeOrmPaymentProviderEventRepository(dataSource).findByProviderEvent('vnpay', input.providerEventId))?.processingStatus).toBe('processed');

      const retryInput = { ...input, providerEventId: `retry-${suffix}`, payloadHash: 'd'.repeat(64) };
      const retryFirst = await repository.claim(retryInput);
      await expect(repository.completeWithBusinessEffect(retryFirst.event.id, payment.id, async (manager) => {
        await manager.getRepository(PaymentEntity).update(payment.id, { providerReference: 'must-roll-back' });
        throw new Error('simulated business failure');
      })).rejects.toThrow('simulated business failure');
      expect((await paymentRepo.findOneByOrFail({ id: payment.id })).providerReference).toBe(input.providerReference);
      await repository.markFailed(retryFirst.event.id, 'TEMPORARY_FAILURE');
      expect((await repository.claim(retryInput)).claimed).toBe(true);
      const retryEvent = await repository.findByProviderEvent('vnpay', retryInput.providerEventId);
      await repository.markRejected(retryEvent!.id, 'INVALID_SIGNATURE');
      expect((await repository.claim(retryInput)).claimed).toBe(false);
    } finally {
      await eventRepo.delete({ provider: 'vnpay', providerEventId: input.providerEventId });
      await eventRepo.delete({ provider: 'vnpay', providerEventId: `retry-${suffix}` });
      await paymentRepo.delete(payment.id); await orderRepo.delete(order.id); await customerRepo.delete(customer.id); await userRepo.delete(user.id);
    }
  });
});
