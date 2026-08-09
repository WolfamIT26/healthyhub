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
import * as orderEntities from '../../src/data/order/entities';
import * as paymentEntities from '../../src/data/payment/entities';
import { ProductEntity } from '../../src/data/product/entities';
import * as productEntities from '../../src/data/product/entities';
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
import { CartService } from '../../src/presentation/cart/cart.service';

const enabled = process.env.CART_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Cart server persistence MySQL integration', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      ...createTypeOrmOptions(getValidatedEnvironment(process.env)),
      migrations: [CreateUserIdentityFoundation1760000000000, CreateAuthenticationData1760000001000,
        CreateCartDependencyFoundation1760000002000, CreateCartPersistence1760000003000,
        CreateOrderCreationFoundation1760000004000],
      entities: [...Object.values(authenticationEntities), ...Object.values(cartEntities),
        ...Object.values(customerEntities), ...Object.values(inventoryEntities), ...Object.values(orderEntities),
        ...Object.values(paymentEntities), ...Object.values(productEntities), ...Object.values(shippingEntities),
        ...Object.values(userEntities)],
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('persists reload/login, isolates owners and merges concurrent duplicate Add', async () => {
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const users = dataSource.getRepository(UserAccountEntity);
    const customers = dataSource.getRepository(CustomerProfileEntity);
    const products = dataSource.getRepository(ProductEntity);
    const inventory = dataSource.getRepository(InventoryItemEntity);
    const carts = dataSource.getRepository(CartEntity);
    const cartItems = dataSource.getRepository(CartItemEntity);
    const createdUsers: UserAccountEntity[] = [];

    for (const label of ['a', 'b']) {
      createdUsers.push(await users.save(users.create({
        email: `cart-${label}-${suffix}@example.test`, normalizedEmail: `cart-${label}-${suffix}@example.test`,
        phone: null, displayName: `Cart Customer ${label.toUpperCase()}`,
        passwordHash: 'integration-fixture-not-a-login-secret', userStatus: 'active',
        emailVerifiedAt: null, lockedUntil: null, lastLoginAt: null,
      })));
    }
    const createdCustomers = await customers.save(createdUsers.map((user, index) => customers.create({
      tenantId: '1', userAccountId: user.id, customerCode: `CUS-CART-${index}-${suffix}`,
      fullName: user.displayName, contactInfo: { email: user.email }, customerStatus: 'active',
      consentState: 'unknown', marketingOptInStatus: 'not_opted_in',
    })));
    const product = await products.save(products.create({
      tenantId: '1', brandId: null, productCode: `CART-PERSIST-${suffix}`,
      productName: 'Persistent Cart Product', slug: `persistent-cart-product-${suffix}`,
      basePrice: '125000.00', sellableStatus: 'sellable', productVisibility: 'public', productStatus: 'active',
    }));
    const stock = await inventory.save(inventory.create({
      tenantId: '1', productId: product.id, availableQuantity: 5, reservedQuantity: 0,
      stockThreshold: 1, stockStatus: 'available',
    }));

    const repository = new TypeOrmCartRepository(dataSource);
    const service = new CartService(
      repository,
      new ProductCommerceReader({ findById: (id) => products.findOneBy({ id }) }),
      new InventoryAvailabilityReader({ findByProductId: (productId) => inventory.findOneBy({ productId }) }),
      new CustomerOwnerResolver({
        findActiveByUserAccountId: (userAccountId) => customers.findOneBy({ userAccountId, customerStatus: 'active' }),
      }),
    );
    const authA = actor(createdUsers[0].id);
    const authB = actor(createdUsers[1].id);

    try {
      await Promise.all([service.add(authA, product.id, 1), service.add(authA, product.id, 1)]);
      await service.add(authA, product.id, 1);

      const reloaded = await service.get(authA);
      expect(reloaded).toMatchObject({ itemCount: 3, subtotal: '375000.00' });
      expect(reloaded.items).toHaveLength(1);
      expect(await carts.countBy({ customerProfileId: createdCustomers[0].id, cartStatus: 'active' })).toBe(1);
      expect(await cartItems.countBy({ cartId: reloaded.id, productId: product.id, itemStatus: 'active' })).toBe(1);

      const otherCustomer = await service.get(authB);
      expect(otherCustomer.items).toEqual([]);
      expect(otherCustomer.id).not.toBe(reloaded.id);

      await service.update(authA, reloaded.items[0].id, 4);
      await expect(service.get(authA)).resolves.toMatchObject({ itemCount: 4, subtotal: '500000.00' });
      await service.remove(authA, reloaded.items[0].id);
      await expect(service.get(authA)).resolves.toMatchObject({ itemCount: 0, items: [] });
    } finally {
      await cartItems.createQueryBuilder().delete().where('cart_id IN (SELECT id FROM carts WHERE customer_profile_id IN (:...ids))', { ids: createdCustomers.map((item) => item.id) }).execute();
      await carts.delete({ customerProfileId: createdCustomers[0].id });
      await carts.delete({ customerProfileId: createdCustomers[1].id });
      await inventory.delete(stock.id);
      await products.delete(product.id);
      await customers.delete(createdCustomers.map((item) => item.id));
      await users.delete(createdUsers.map((item) => item.id));
    }
  });
});

function actor(userAccountId: string) {
  return { userAccountId, sessionId: '1', sessionPublicId: `session-${userAccountId}`, roles: ['CUSTOMER'] as const, permissionsVersion: 1 };
}
