import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import * as cartEntities from '../../src/data/cart/entities';
import { CustomerProfileEntity } from '../../src/data/customer/entities';
import * as customerEntities from '../../src/data/customer/entities';
import { InventoryItemEntity } from '../../src/data/inventory/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { ProductEntity } from '../../src/data/product/entities';
import * as productEntities from '../../src/data/product/entities';
import { UserAccountEntity } from '../../src/data/user/entities';
import * as userEntities from '../../src/data/user/entities';
import { CreateUserIdentityFoundation1760000000000 } from '../../src/database/migrations/1760000000000-create-user-identity-foundation';
import { CreateAuthenticationData1760000001000 } from '../../src/database/migrations/1760000001000-create-authentication-data';
import { CreateCartDependencyFoundation1760000002000 } from '../../src/database/migrations/1760000002000-create-cart-dependency-foundation';
import { CreateCartPersistence1760000003000 } from '../../src/database/migrations/1760000003000-create-cart-persistence';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';
import { CustomerOwnerResolver } from '../../src/domain/commerce-dependencies/customer-owner.resolver';
import { InventoryAvailabilityReader } from '../../src/domain/commerce-dependencies/inventory-availability.reader';
import { ProductCommerceReader } from '../../src/domain/commerce-dependencies/product-commerce.reader';

const enabled = process.env.CART_DEPENDENCIES_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Cart dependency MySQL integration', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      ...createTypeOrmOptions(getValidatedEnvironment(process.env)),
      migrations: [
        CreateUserIdentityFoundation1760000000000,
        CreateAuthenticationData1760000001000,
        CreateCartDependencyFoundation1760000002000,
        CreateCartPersistence1760000003000,
      ],
      entities: [
        ...Object.values(authenticationEntities),
        ...Object.values(cartEntities),
        ...Object.values(customerEntities),
        ...Object.values(inventoryEntities),
        ...Object.values(productEntities),
        ...Object.values(userEntities),
      ],
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('has applied the dependency migration and exposes its constraints', async () => {
    await expect(dataSource.showMigrations()).resolves.toBe(false);
    const runner = dataSource.createQueryRunner();
    const product = await runner.getTable('products');
    const inventory = await runner.getTable('inventory_items');
    const customer = await runner.getTable('customer_profiles');

    expect(product?.indices.some((index) => index.isUnique && index.columnNames.includes('slug'))).toBe(true);
    expect(inventory?.foreignKeys.some((key) => key.referencedTableName === 'products')).toBe(true);
    expect(customer?.foreignKeys.some((key) => key.referencedTableName === 'user_accounts')).toBe(true);
    await runner.release();
  });

  it('reads persisted product, inventory and authenticated customer ownership without fallback data', async () => {
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const manager = dataSource.manager;
    const userRepository = manager.getRepository(UserAccountEntity);
    const productRepository = manager.getRepository(ProductEntity);
    const inventoryRepository = manager.getRepository(InventoryItemEntity);
    const customerRepository = manager.getRepository(CustomerProfileEntity);

    const user = await userRepository.save(userRepository.create({
      email: `cart-dependency-${suffix}@example.test`,
      normalizedEmail: `cart-dependency-${suffix}@example.test`,
      phone: null,
      displayName: 'Cart Dependency Test',
      passwordHash: 'integration-fixture-not-a-login-secret',
      userStatus: 'active',
      emailVerifiedAt: null,
      lockedUntil: null,
      lastLoginAt: null,
    }));
    const product = await productRepository.save(productRepository.create({
      tenantId: '1',
      brandId: null,
      productCode: `CART-${suffix}`,
      productName: 'Persisted Cart Product',
      slug: `persisted-cart-product-${suffix}`,
      basePrice: '125000.00',
      sellableStatus: 'sellable',
      productVisibility: 'public',
      productStatus: 'active',
    }));
    const inventory = await inventoryRepository.save(inventoryRepository.create({
      tenantId: '1',
      productId: product.id,
      availableQuantity: 5,
      reservedQuantity: 0,
      stockThreshold: 2,
      stockStatus: 'available',
    }));
    const customer = await customerRepository.save(customerRepository.create({
      tenantId: '1',
      userAccountId: user.id,
      customerCode: `CUS-INT-${suffix}`,
      fullName: user.displayName,
      contactInfo: { email: user.email },
      customerStatus: 'active',
      consentState: 'unknown',
      marketingOptInStatus: 'not_opted_in',
    }));

    try {
      const productReader = new ProductCommerceReader({ findById: (id) => productRepository.findOneBy({ id }) });
      const inventoryReader = new InventoryAvailabilityReader({
        findByProductId: (productId) => inventoryRepository.findOneBy({ productId }),
      });
      const ownerResolver = new CustomerOwnerResolver({
        findActiveByUserAccountId: (userAccountId) => customerRepository.findOneBy({ userAccountId, customerStatus: 'active' }),
      });

      await expect(productReader.findSellableProduct(product.id)).resolves.toMatchObject({
        productId: product.id,
        currentPrice: '125000.00',
        currency: 'VND',
        sellable: true,
      });
      await expect(productReader.findSellableProduct('999999999999')).resolves.toBeNull();
      await expect(inventoryReader.checkAvailability(product.id, 3)).resolves.toEqual({
        status: 'AVAILABLE',
        availableQuantity: 5,
      });
      await expect(inventoryReader.checkAvailability('999999999999', 1)).resolves.toEqual({
        status: 'UNAVAILABLE',
        availableQuantity: null,
      });
      await expect(ownerResolver.resolve({
        userAccountId: user.id,
        sessionId: '1',
        sessionPublicId: 'integration-session',
        roles: ['CUSTOMER'],
        permissionsVersion: 1,
      })).resolves.toEqual({ customerProfileId: customer.id, userAccountId: user.id });
    } finally {
      await inventoryRepository.delete(inventory.id);
      await customerRepository.delete(customer.id);
      await productRepository.delete(product.id);
      await userRepository.delete(user.id);
    }
  });
});
