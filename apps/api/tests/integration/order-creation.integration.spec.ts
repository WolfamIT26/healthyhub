import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import { CartEntity, CartItemEntity } from '../../src/data/cart/entities';
import * as cartEntities from '../../src/data/cart/entities';
import { TypeOrmCartRepository } from '../../src/data/cart/repositories';
import { CustomerProfileEntity } from '../../src/data/customer/entities';
import * as customerEntities from '../../src/data/customer/entities';
import { InventoryItemEntity } from '../../src/data/inventory/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { OrderEntity, OrderItemEntity } from '../../src/data/order/entities';
import * as orderEntities from '../../src/data/order/entities';
import { TypeOrmOrderRepository } from '../../src/data/order/repositories';
import { PaymentEntity } from '../../src/data/payment/entities';
import * as paymentEntities from '../../src/data/payment/entities';
import { ProductEntity } from '../../src/data/product/entities';
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
import { createTypeOrmOptions } from '../../src/database/typeorm.config';
import { CustomerOwnerResolver } from '../../src/domain/commerce-dependencies/customer-owner.resolver';
import { InventoryAvailabilityReader } from '../../src/domain/commerce-dependencies/inventory-availability.reader';
import { ProductCommerceReader } from '../../src/domain/commerce-dependencies/product-commerce.reader';
import { PaymentMethodReader } from '../../src/domain/payment/payment-method.reader';
import { ShippingQuoteService } from '../../src/domain/shipping/shipping-quote.service';
import { EmailVerificationPolicyService } from '../../src/presentation/authentication/email-verification-policy.service';
import { OrderCreationService } from '../../src/presentation/order/order-creation.service';

const enabled = process.env.ORDER_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Order creation MySQL integration', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      ...createTypeOrmOptions(getValidatedEnvironment({ ...process.env, PAYMENT_PROVIDER: 'not_configured' })),
      migrations: [
        CreateUserIdentityFoundation1760000000000,
        CreateAuthenticationData1760000001000,
        CreateCartDependencyFoundation1760000002000,
        CreateCartPersistence1760000003000,
        CreateOrderCreationFoundation1760000004000,
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
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('persists one authoritative snapshot and isolates another Customer', async () => {
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const users = dataSource.getRepository(UserAccountEntity);
    const customers = dataSource.getRepository(CustomerProfileEntity);
    const products = dataSource.getRepository(ProductEntity);
    const inventories = dataSource.getRepository(InventoryItemEntity);
    const createdUsers = [];
    for (const label of ['a', 'b']) {
      createdUsers.push(
        await users.save(
          users.create({
            email: `order-${label}-${suffix}@example.test`,
            normalizedEmail: `order-${label}-${suffix}@example.test`,
            phone: null,
            displayName: `Order Customer ${label.toUpperCase()}`,
            passwordHash: 'integration-fixture-not-a-login-secret',
            userStatus: 'active',
            emailVerifiedAt: new Date(),
            lockedUntil: null,
            lastLoginAt: null,
          }),
        ),
      );
    }
    const createdCustomers = await customers.save(
      createdUsers.map((user, index) =>
        customers.create({
          tenantId: '1',
          userAccountId: user.id,
          customerCode: `CUS-ORDER-${index}-${suffix}`,
          fullName: user.displayName,
          contactInfo: { email: user.email },
          customerStatus: 'active',
          consentState: 'unknown',
          marketingOptInStatus: 'not_opted_in',
        }),
      ),
    );
    const product = await products.save(
      products.create({
        tenantId: '1',
        brandId: null,
        productCode: `ORDER-${suffix}`,
        productName: 'Order Snapshot Product',
        slug: `order-snapshot-${suffix}`,
        basePrice: '125000.00',
        sellableStatus: 'sellable',
        productVisibility: 'public',
        productStatus: 'active',
      }),
    );
    const inventory = await inventories.save(
      inventories.create({
        tenantId: '1',
        productId: product.id,
        availableQuantity: 5,
        reservedQuantity: 0,
        stockThreshold: 1,
        stockStatus: 'available',
      }),
    );

    const cartRepository = new TypeOrmCartRepository(dataSource);
    await cartRepository.addOrMerge(createdCustomers[0].id, createdUsers[0].id, product.id, 2, 5);
    const cart = await cartRepository.findActive(createdCustomers[0].id);
    const shipping = new ShippingQuoteService();
    const address = {
      recipientName: 'Nguyễn Văn A',
      phone: '0901234567',
      countryCode: 'VN',
      provinceCity: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Bến Nghé',
      addressLine: '12 Nguyễn Huệ',
    };
    const quote = shipping.quote(address, 'manual', {
      cartId: cart!.id,
      subtotal: '250000.00',
      itemCount: 2,
      isValid: true,
    });
    const productReader = new ProductCommerceReader({
      findById: (id) => products.findOneBy({ id }),
    });
    const inventoryReader = new InventoryAvailabilityReader({
      findByProductId: (productId) => inventories.findOneBy({ productId }),
    });
    const ownerResolver = new CustomerOwnerResolver({
      findActiveByUserAccountId: (userAccountId) =>
        customers.findOneBy({ userAccountId, customerStatus: 'active' }),
    });
    const orderRepository = new TypeOrmOrderRepository(dataSource);
    const service = new OrderCreationService(
      orderRepository,
      cartRepository,
      { findAccountById: (id: string) => users.findOneBy({ id }) } as never,
      ownerResolver,
      productReader,
      inventoryReader,
      shipping,
      new PaymentMethodReader(),
      new EmailVerificationPolicyService(),
    );
    const request = {
      shippingAddress: address,
      shippingMethod: 'manual' as const,
      shippingQuoteReference: quote.quoteReference,
      paymentMethod: 'cod' as const,
    };

    let createdOrderId: string | null = null;
    try {
      const first = await service.createOrderFromCheckout(
        actor(createdUsers[0].id),
        `order-attempt-${suffix}`,
        request,
      );
      createdOrderId = first.orderId;
      const retry = await service.createOrderFromCheckout(
        actor(createdUsers[0].id),
        `order-attempt-${suffix}`,
        request,
      );
      expect(retry.orderId).toBe(first.orderId);
      expect(first).toMatchObject({
        subtotal: '250000.00',
        shippingFee: '0.00',
        total: '250000.00',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        shippingMethod: 'manual',
        items: [
          {
            productName: 'Order Snapshot Product',
            unitPrice: '125000.00',
            quantity: 2,
            lineTotal: '250000.00',
          },
        ],
      });
      expect(
        await dataSource
          .getRepository(OrderEntity)
          .countBy({ customerProfileId: createdCustomers[0].id }),
      ).toBe(1);
      expect(
        await dataSource.getRepository(OrderItemEntity).countBy({ orderId: first.orderId }),
      ).toBe(1);
      expect(
        await dataSource.getRepository(PaymentEntity).findOneByOrFail({ orderId: first.orderId }),
      ).toMatchObject({
        paymentMethod: 'cod',
        paymentAmount: '250000.00',
        paymentStatus: 'pending',
        paidAt: null,
        providerReference: null,
      });
      const persistedShipment = await dataSource
        .getRepository(ShipmentEntity)
        .findOneByOrFail({ orderId: first.orderId });
      expect(persistedShipment).toMatchObject({ shippingFee: '0.00', shippingStatus: 'pending' });
      const storedAddress = await dataSource
        .getRepository(ShippingAddressEntity)
        .findOneByOrFail({ shipmentId: persistedShipment.id });
      expect(storedAddress).toMatchObject({
        recipientName: address.recipientName,
        recipientPhone: address.phone,
        deliveryNote: null,
      });
      expect(JSON.parse(storedAddress.addressText)).toMatchObject({
        countryCode: 'VN',
        addressLine: address.addressLine,
      });

      await expect(
        service.createOrderFromCheckout(
          actor(createdUsers[1].id),
          `order-attempt-b-${suffix}`,
          request,
        ),
      ).rejects.toMatchObject({ response: { code: 'ORDER.CART_EMPTY' } });

      const orderCountBeforeRollbackAttempt = await dataSource
        .getRepository(OrderEntity)
        .countBy({ customerProfileId: createdCustomers[0].id });
      await expect(
        orderRepository.createSnapshot({
          customerProfileId: createdCustomers[0].id,
          cartId: cart!.id,
          orderCode: `HH-ROLLBACK-${suffix}`,
          orderTotal: '125000.00',
          idempotencyKeyHash: 'a'.repeat(64),
          requestHash: 'b'.repeat(64),
          actorUserAccountId: createdUsers[0].id,
          items: [
            {
              productId: product.id,
              productName: product.productName,
              sku: product.productCode,
              unitPrice: product.basePrice,
              quantity: 0,
              lineTotal: '0.00',
            },
          ],
          payment: { method: 'cod', amount: '125000.00', status: 'pending' },
          shipping: {
            method: 'manual',
            fee: '0.00',
            address: {
              recipientName: address.recipientName,
              phone: address.phone,
              addressText: JSON.stringify(address),
              note: null,
            },
          },
        }),
      ).rejects.toBeDefined();
      expect(
        await dataSource
          .getRepository(OrderEntity)
          .countBy({ customerProfileId: createdCustomers[0].id }),
      ).toBe(orderCountBeforeRollbackAttempt);
    } finally {
      if (createdOrderId) {
        const shipment = await dataSource
          .getRepository(ShipmentEntity)
          .findOneBy({ orderId: createdOrderId });
        if (shipment)
          await dataSource.getRepository(ShippingAddressEntity).delete({ shipmentId: shipment.id });
        await dataSource.getRepository(ShipmentEntity).delete({ orderId: createdOrderId });
        await dataSource.getRepository(PaymentEntity).delete({ orderId: createdOrderId });
        await dataSource.getRepository(OrderItemEntity).delete({ orderId: createdOrderId });
        await dataSource.getRepository(OrderEntity).delete(createdOrderId);
      }
      if (cart) {
        await dataSource.getRepository(CartItemEntity).delete({ cartId: cart.id });
        await dataSource.getRepository(CartEntity).delete(cart.id);
      }
      await inventories.delete(inventory.id);
      await products.delete(product.id);
      await customers.delete(createdCustomers.map((item) => item.id));
      await users.delete(createdUsers.map((item) => item.id));
    }
  });
});

function actor(userAccountId: string) {
  return {
    userAccountId,
    sessionId: '1',
    sessionPublicId: `session-${userAccountId}`,
    roles: ['CUSTOMER'] as const,
    permissionsVersion: 1,
  };
}
