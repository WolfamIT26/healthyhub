import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import * as cartEntities from '../../src/data/cart/entities';
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
import { WishlistEntity, WishlistItemEntity } from '../../src/data/wishlist/entities';
import * as wishlistEntities from '../../src/data/wishlist/entities';
import { TypeOrmWishlistRepository } from '../../src/data/wishlist/repositories';
import { CreateUserIdentityFoundation1760000000000 } from '../../src/database/migrations/1760000000000-create-user-identity-foundation';
import { CreateAuthenticationData1760000001000 } from '../../src/database/migrations/1760000001000-create-authentication-data';
import { CreateCartDependencyFoundation1760000002000 } from '../../src/database/migrations/1760000002000-create-cart-dependency-foundation';
import { CreateCartPersistence1760000003000 } from '../../src/database/migrations/1760000003000-create-cart-persistence';
import { CreateOrderCreationFoundation1760000004000 } from '../../src/database/migrations/1760000004000-create-order-creation-foundation';
import { CreatePaymentProviderEvents1760000005000 } from '../../src/database/migrations/1760000005000-create-payment-provider-events';
import { EnableVnpaySandbox1760000006000 } from '../../src/database/migrations/1760000006000-enable-vnpay-sandbox';
import { EnableOrderConfirmation1760000007000 } from '../../src/database/migrations/1760000007000-enable-order-confirmation';
import { EnableCustomerProfileAddressV11760000008000 } from '../../src/database/migrations/1760000008000-enable-customer-profile-address-v1';
import { EnableWishlistPersistenceV11760000009000 } from '../../src/database/migrations/1760000009000-enable-wishlist-persistence-v1';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';
import { CustomerOwnerResolver } from '../../src/domain/commerce-dependencies/customer-owner.resolver';
import { InventoryAvailabilityReader } from '../../src/domain/commerce-dependencies/inventory-availability.reader';
import { ProductCommerceReader } from '../../src/domain/commerce-dependencies/product-commerce.reader';
import { WishlistService } from '../../src/presentation/wishlist/wishlist.service';

const enabled = process.env.WISHLIST_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Wishlist persistence MySQL integration', () => {
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
        EnableWishlistPersistenceV11760000009000,
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
        ...Object.values(wishlistEntities),
      ],
    });
    await dataSource.initialize();
    await dataSource.runMigrations();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('persists reload, isolates owners and deduplicates concurrent Add', async () => {
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const users = dataSource.getRepository(UserAccountEntity);
    const customers = dataSource.getRepository(CustomerProfileEntity);
    const products = dataSource.getRepository(ProductEntity);
    const inventory = dataSource.getRepository(InventoryItemEntity);
    const wishlists = dataSource.getRepository(WishlistEntity);
    const wishlistItems = dataSource.getRepository(WishlistItemEntity);
    const createdUsers = await users.save(
      ['a', 'b'].map((label) =>
        users.create({
          email: `wishlist-${label}-${suffix}@example.test`,
          normalizedEmail: `wishlist-${label}-${suffix}@example.test`,
          phone: null,
          displayName: `Wishlist Customer ${label.toUpperCase()}`,
          passwordHash: 'integration-fixture-not-a-login-secret',
          userStatus: 'active',
          emailVerifiedAt: null,
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
          customerCode: `CUS-WISHLIST-${index}-${suffix}`,
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
        productCode: `WISHLIST-${suffix}`,
        productName: 'Wishlist Persistent Product',
        slug: `wishlist-persistent-product-${suffix}`,
        basePrice: '99000.00',
        sellableStatus: 'out_of_stock',
        productVisibility: 'public',
        productStatus: 'active',
      }),
    );
    const stock = await inventory.save(
      inventory.create({
        tenantId: '1',
        productId: product.id,
        availableQuantity: 0,
        reservedQuantity: 0,
        stockThreshold: 1,
        stockStatus: 'out_of_stock',
      }),
    );
    const service = new WishlistService(
      new TypeOrmWishlistRepository(dataSource),
      new ProductCommerceReader({ findById: (id) => products.findOneBy({ id }) }),
      new InventoryAvailabilityReader({
        findByProductId: (productId) => inventory.findOneBy({ productId }),
      }),
      new CustomerOwnerResolver({
        findActiveByUserAccountId: (userAccountId) =>
          customers.findOneBy({ userAccountId, customerStatus: 'active' }),
      }),
    );
    const authA = actor(createdUsers[0].id);
    const authB = actor(createdUsers[1].id);

    try {
      await Promise.all([service.add(authA, product.id), service.add(authA, product.id)]);
      const reloaded = await service.get(authA, { page: 1, pageSize: 20 });
      expect(reloaded).toMatchObject({
        totalItems: 1,
        items: [{ product: { productId: product.id, availability: 'OUT_OF_STOCK' } }],
      });
      const wishlistA = await wishlists.findOneByOrFail({
        customerProfileId: createdCustomers[0].id,
        wishlistStatus: 'active',
      });
      expect(await wishlists.countBy({ customerProfileId: createdCustomers[0].id })).toBe(1);
      expect(
        await wishlistItems.countBy({
          wishlistId: wishlistA.id,
          productId: product.id,
          wishlistItemStatus: 'active',
        }),
      ).toBe(1);
      await expect(service.get(authB, { page: 1, pageSize: 20 })).resolves.toMatchObject({
        totalItems: 0,
        items: [],
      });
      await expect(
        service.removeItem(authB, reloaded.items[0].wishlistItemId),
      ).rejects.toMatchObject({ status: 404 });
      await expect(service.add(authA, '999999999999')).rejects.toMatchObject({ status: 404 });

      await service.removeProduct(authA, product.id);
      await expect(service.get(authA, { page: 1, pageSize: 20 })).resolves.toMatchObject({
        totalItems: 0,
      });
      await service.add(authA, product.id);
      await expect(service.get(authA, { page: 1, pageSize: 20 })).resolves.toMatchObject({
        totalItems: 1,
      });
    } finally {
      await wishlistItems
        .createQueryBuilder()
        .delete()
        .where('wishlist_id IN (SELECT id FROM wishlists WHERE customer_profile_id IN (:...ids))', {
          ids: createdCustomers.map((customer) => customer.id),
        })
        .execute();
      await wishlists.delete({ customerProfileId: createdCustomers[0].id });
      await wishlists.delete({ customerProfileId: createdCustomers[1].id });
      await inventory.delete(stock.id);
      await products.delete(product.id);
      await customers.delete(createdCustomers.map((customer) => customer.id));
      await users.delete(createdUsers.map((user) => user.id));
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
