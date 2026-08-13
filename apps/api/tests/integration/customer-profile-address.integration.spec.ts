import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import { CartEntity } from '../../src/data/cart/entities';
import * as cartEntities from '../../src/data/cart/entities';
import { CustomerAddressEntity, CustomerProfileEntity } from '../../src/data/customer/entities';
import * as customerEntities from '../../src/data/customer/entities';
import { TypeOrmCustomerRepository } from '../../src/data/customer/repositories';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { OrderEntity, OrderItemEntity } from '../../src/data/order/entities';
import * as orderEntities from '../../src/data/order/entities';
import { TypeOrmOrderRepository } from '../../src/data/order/repositories';
import { PaymentEntity } from '../../src/data/payment/entities';
import * as paymentEntities from '../../src/data/payment/entities';
import * as productEntities from '../../src/data/product/entities';
import { ShipmentEntity, ShippingAddressEntity } from '../../src/data/shipping/entities';
import * as shippingEntities from '../../src/data/shipping/entities';
import { UserAccountEntity } from '../../src/data/user/entities';
import * as userEntities from '../../src/data/user/entities';
import { CreateUserIdentityFoundation1760000000000 } from '../../src/database/migrations/1760000000000-create-user-identity-foundation';
import { CreateAuthenticationData1760000001000 } from '../../src/database/migrations/1760000001000-create-authentication-data';
import { CreateCartDependencyFoundation1760000002000 } from '../../src/database/migrations/1760000002000-create-cart-dependency-foundation';
import { CreateCartPersistence1760000003000 } from '../../src/database/migrations/1760000003000-create-cart-persistence';
import { CreateOrderCreationFoundation1760000004000 } from '../../src/database/migrations/1760000004000-create-order-creation-foundation';
import { CreatePaymentProviderEvents1760000005000 } from '../../src/database/migrations/1760000005000-create-payment-provider-events';
import { EnableVnpaySandbox1760000006000 } from '../../src/database/migrations/1760000006000-enable-vnpay-sandbox';
import { EnableOrderConfirmation1760000007000 } from '../../src/database/migrations/1760000007000-enable-order-confirmation';
import { EnableCustomerProfileAddressV11760000008000 } from '../../src/database/migrations/1760000008000-enable-customer-profile-address-v1';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';
import { CustomerOwnerResolver } from '../../src/domain/commerce-dependencies/customer-owner.resolver';
import { ShippingQuoteService } from '../../src/domain/shipping/shipping-quote.service';
import { CustomerService } from '../../src/presentation/customer/customer.service';

const enabled = process.env.CUSTOMER_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Customer Profile and Address MySQL integration', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      ...createTypeOrmOptions(
        getValidatedEnvironment({ ...process.env, PAYMENT_PROVIDER: 'not_configured' }),
      ),
      migrations: [
        CreateUserIdentityFoundation1760000000000,
        CreateAuthenticationData1760000001000,
        CreateCartDependencyFoundation1760000002000,
        CreateCartPersistence1760000003000,
        CreateOrderCreationFoundation1760000004000,
        CreatePaymentProviderEvents1760000005000,
        EnableVnpaySandbox1760000006000,
        EnableOrderConfirmation1760000007000,
        EnableCustomerProfileAddressV11760000008000,
      ],
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
    await dataSource.runMigrations();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('enforces ownership/defaults and preserves the immutable Order address snapshot', async () => {
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const users = dataSource.getRepository(UserAccountEntity);
    const customers = dataSource.getRepository(CustomerProfileEntity);
    const addresses = dataSource.getRepository(CustomerAddressEntity);
    const createdUsers = await users.save(
      ['a', 'b'].map((label) =>
        users.create({
          email: `profile-${label}-${suffix}@example.test`,
          normalizedEmail: `profile-${label}-${suffix}@example.test`,
          phone: null,
          displayName: `Profile Customer ${label.toUpperCase()}`,
          passwordHash: 'integration-fixture-not-a-login-secret',
          userStatus: 'active',
          emailVerifiedAt: new Date(),
          lockedUntil: null,
          lastLoginAt: null,
        }),
      ),
    );
    const createdCustomers = await customers.save(
      createdUsers.map((user, index) =>
        customers.create({
          tenantId: '1',
          userAccountId: user.id,
          customerCode: `CUS-PROFILE-${index}-${suffix}`,
          fullName: user.displayName,
          contactInfo: { email: user.email },
          customerStatus: 'active',
          consentState: 'unknown',
          marketingOptInStatus: 'not_opted_in',
        }),
      ),
    );
    const repository = new TypeOrmCustomerRepository(dataSource);
    const service = new CustomerService(
      repository,
      new CustomerOwnerResolver({
        findActiveByUserAccountId: (userAccountId) =>
          customers.findOneBy({ userAccountId, customerStatus: 'active' }),
      }),
      new ShippingQuoteService(),
    );
    const authA = actor(createdUsers[0].id);
    const authB = actor(createdUsers[1].id);
    let cart: CartEntity | null = null;
    let orderId: string | null = null;

    try {
      await service.updateProfile(authA, `profile-update-${suffix}`, {
        fullName: 'Customer A Updated',
        phone: '0901234567',
      });
      await expect(service.getProfile(authA)).resolves.toMatchObject({
        fullName: 'Customer A Updated',
        email: createdUsers[0].email,
        phone: '0901234567',
      });
      expect(await users.findOneByOrFail({ id: createdUsers[0].id })).toMatchObject({
        displayName: 'Customer A Updated',
        phone: '0901234567',
      });

      const first = await service.createAddress(authA, `address-first-${suffix}`, {
        recipientName: 'Nguyễn Văn A',
        phone: '0901234567',
        countryCode: 'VN',
        provinceCity: 'Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Bến Nghé',
        addressLine: '12 Nguyễn Huệ',
        isDefault: false,
      });
      expect(first.isDefault).toBe(true);
      const second = await service.createAddress(authA, `address-second-${suffix}`, {
        recipientName: 'Nguyễn Văn A',
        phone: '0901234567',
        countryCode: 'VN',
        provinceCity: 'Hồ Chí Minh',
        district: 'Quận 3',
        addressLine: '34 Võ Văn Tần',
        isDefault: true,
      });
      expect((await service.listAddresses(authA)).filter((item) => item.isDefault)).toHaveLength(1);
      await expect(
        service.updateAddress(authB, first.addressId, `address-isolation-${suffix}`, {
          addressLine: 'Không thuộc Customer B',
        }),
      ).rejects.toMatchObject({ status: 404 });

      const carts = dataSource.getRepository(CartEntity);
      cart = await carts.save(
        carts.create({
          tenantId: '1',
          customerProfileId: createdCustomers[0].id,
          cartOwnerType: 'customer',
          guestSessionReference: null,
          cartStatus: 'checked_out',
          cartValidationStatus: 'valid',
          lastValidatedAt: new Date(),
          createdBy: createdUsers[0].id,
          updatedBy: createdUsers[0].id,
        }),
      );
      const order = await new TypeOrmOrderRepository(dataSource).createSnapshot({
        customerProfileId: createdCustomers[0].id,
        cartId: cart.id,
        orderCode: `HH-PROFILE-${suffix}`,
        orderTotal: '125000.00',
        idempotencyKeyHash: 'c'.repeat(64),
        requestHash: 'd'.repeat(64),
        actorUserAccountId: createdUsers[0].id,
        items: [
          {
            productId: null,
            productName: 'Snapshot Fixture',
            sku: 'SNAPSHOT-FIXTURE',
            unitPrice: '125000.00',
            quantity: 1,
            lineTotal: '125000.00',
          },
        ],
        payment: { method: 'cod', amount: '125000.00', status: 'pending' },
        shipping: {
          method: 'manual',
          fee: '0.00',
          address: {
            recipientName: first.recipientName,
            phone: first.phone,
            addressText: JSON.stringify(first),
            note: first.note,
          },
        },
      });
      orderId = order.order.id;
      await service.updateAddress(authA, first.addressId, `address-edit-${suffix}`, {
        addressLine: '99 Địa chỉ mới',
      });
      const persistedSnapshot = await dataSource
        .getRepository(ShippingAddressEntity)
        .findOneByOrFail({ shipmentId: order.shipment.id });
      expect(JSON.parse(persistedSnapshot.addressText)).toMatchObject({
        addressLine: '12 Nguyễn Huệ',
      });

      await service.deleteAddress(authA, second.addressId, `address-delete-${suffix}`);
      expect(
        (await service.listAddresses(authA)).find((item) => item.addressId === first.addressId),
      ).toMatchObject({ isDefault: true, addressLine: '99 Địa chỉ mới' });
      await expect(
        service.deleteAddress(authA, second.addressId, `address-delete-repeat-${suffix}`),
      ).resolves.toEqual({ addressId: second.addressId, deleted: true });
    } finally {
      if (orderId) {
        const shipment = await dataSource.getRepository(ShipmentEntity).findOneBy({ orderId });
        if (shipment) {
          await dataSource.getRepository(ShippingAddressEntity).delete({ shipmentId: shipment.id });
        }
        await dataSource.getRepository(ShipmentEntity).delete({ orderId });
        await dataSource.getRepository(PaymentEntity).delete({ orderId });
        await dataSource.getRepository(OrderItemEntity).delete({ orderId });
        await dataSource.getRepository(OrderEntity).delete(orderId);
      }
      if (cart) await dataSource.getRepository(CartEntity).delete(cart.id);
      await addresses
        .createQueryBuilder()
        .delete()
        .where('customer_profile_id IN (:...ids)', { ids: createdCustomers.map((item) => item.id) })
        .execute();
      await customers.delete(createdCustomers.map((item) => item.id));
      await users.delete(createdUsers.map((item) => item.id));
    }
  });
});

function actor(userAccountId: string) {
  return {
    userAccountId,
    sessionId: '1',
    sessionPublicId: 'session-customer-profile',
    roles: ['CUSTOMER' as const],
    permissionsVersion: 1,
  };
}
