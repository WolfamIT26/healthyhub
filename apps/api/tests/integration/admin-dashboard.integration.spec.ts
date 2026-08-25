import { DataSource } from 'typeorm';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import * as cartEntities from '../../src/data/cart/entities';
import { CustomerProfileEntity } from '../../src/data/customer/entities';
import * as customerEntities from '../../src/data/customer/entities';
import { InventoryItemEntity } from '../../src/data/inventory/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { OrderEntity } from '../../src/data/order/entities';
import * as orderEntities from '../../src/data/order/entities';
import * as paymentEntities from '../../src/data/payment/entities';
import { ProductEntity } from '../../src/data/product/entities';
import * as productEntities from '../../src/data/product/entities';
import { ProductReviewEntity } from '../../src/data/review/entities';
import * as reviewEntities from '../../src/data/review/entities';
import * as shippingEntities from '../../src/data/shipping/entities';
import { UserAccountEntity } from '../../src/data/user/entities';
import * as userEntities from '../../src/data/user/entities';
import { TypeOrmAdminDashboardRepository } from '../../src/data/admin/repositories';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';

const enabled = process.env.ADMIN_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Admin Dashboard MySQL integration', () => {
  let dataSource: DataSource;
  let repository: TypeOrmAdminDashboardRepository;
  const created = {
    reviewIds: [] as string[],
    orderIds: [] as string[],
    inventoryIds: [] as string[],
    productIds: [] as string[],
    customerIds: [] as string[],
    userIds: [] as string[],
  };

  beforeAll(async () => {
    dataSource = new DataSource({
      ...createTypeOrmOptions(
        getValidatedEnvironment({ ...process.env, PAYMENT_PROVIDER: 'not_configured' }),
      ),
      migrations: [],
      entities: [
        ...Object.values(authenticationEntities),
        ...Object.values(cartEntities),
        ...Object.values(customerEntities),
        ...Object.values(inventoryEntities),
        ...Object.values(orderEntities),
        ...Object.values(paymentEntities),
        ...Object.values(productEntities),
        ...Object.values(reviewEntities),
        ...Object.values(shippingEntities),
        ...Object.values(userEntities),
      ],
    });
    await dataSource.initialize();
    repository = new TypeOrmAdminDashboardRepository(dataSource);
  });

  afterEach(async () => cleanup());
  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('derives real aggregates and excludes records outside the canonical tenant', async () => {
    const baseline = await repository.readMetrics('1');
    await createFixture('1', 'primary');
    await createFixture('2', 'foreign');

    const result = await repository.readMetrics('1');

    expect(result.products).toEqual({
      total: baseline.products.total + 1,
      activePublic: baseline.products.activePublic + 1,
      unavailable: baseline.products.unavailable + 1,
    });
    expect(result.orders.total).toBe(baseline.orders.total + 1);
    expect(result.orders.byStatus.completed).toBe(baseline.orders.byStatus.completed + 1);
    expect(result.orders.byStatus.cancelled).toBe(baseline.orders.byStatus.cancelled);
    expect(result.reviews.total).toBe(baseline.reviews.total + 1);
    expect(result.reviews.byStatus.published).toBe(baseline.reviews.byStatus.published + 1);
    expect(result.reviews.byStatus.hidden).toBe(baseline.reviews.byStatus.hidden);
  });

  async function createFixture(tenantId: '1' | '2', label: string) {
    const suffix = `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const users = dataSource.getRepository(UserAccountEntity);
    const user = await users.save(
      users.create({
        email: `admin-dashboard-${suffix}@example.test`,
        normalizedEmail: `admin-dashboard-${suffix}@example.test`,
        phone: null,
        displayName: `Dashboard ${label}`,
        passwordHash: 'integration-fixture-not-a-login-secret',
        userStatus: 'active',
        emailVerifiedAt: new Date(),
        lockedUntil: null,
        lastLoginAt: null,
        permissionsVersion: 1,
      }),
    );
    created.userIds.push(user.id);

    const customers = dataSource.getRepository(CustomerProfileEntity);
    const customer = await customers.save(
      customers.create({
        tenantId,
        userAccountId: user.id,
        customerCode: `CUS-ADMIN-${suffix}`.slice(0, 64),
        fullName: `Dashboard ${label}`,
        contactInfo: null,
        customerStatus: 'active',
        consentState: 'unknown',
        marketingOptInStatus: 'not_opted_in',
      }),
    );
    created.customerIds.push(customer.id);

    const products = dataSource.getRepository(ProductEntity);
    const product = await products.save(
      products.create({
        tenantId,
        brandId: null,
        productCode: `ADMIN-${suffix}`.slice(0, 64),
        productName: `Dashboard Product ${label}`,
        slug: `admin-dashboard-${suffix}`.slice(0, 191),
        basePrice: '100000.00',
        sellableStatus: 'out_of_stock',
        productVisibility: 'public',
        productStatus: 'active',
        isFeatured: false,
      }),
    );
    created.productIds.push(product.id);

    const inventories = dataSource.getRepository(InventoryItemEntity);
    const inventory = await inventories.save(
      inventories.create({
        tenantId,
        productId: product.id,
        availableQuantity: 0,
        reservedQuantity: 0,
        stockThreshold: 2,
        stockStatus: 'out_of_stock',
      }),
    );
    created.inventoryIds.push(inventory.id);

    const orders = dataSource.getRepository(OrderEntity);
    const order = await orders.save(
      orders.create({
        tenantId,
        customerProfileId: customer.id,
        cartId: null,
        orderCode: `ORD-ADMIN-${suffix}`.slice(0, 64),
        orderSource: 'web',
        orderStatus: tenantId === '1' ? 'completed' : 'cancelled',
        paymentStatusSnapshot: tenantId === '1' ? 'paid' : 'cancelled',
        shippingStatusSnapshot: tenantId === '1' ? 'delivered' : 'cancelled',
        orderTotal: '100000.00',
        idempotencyKeyHash: (tenantId === '1' ? 'a' : 'b').repeat(64),
        requestHash: (tenantId === '1' ? 'c' : 'd').repeat(64),
        placedAt: new Date(),
        completedAt: tenantId === '1' ? new Date() : null,
      }),
    );
    created.orderIds.push(order.id);

    const reviews = dataSource.getRepository(ProductReviewEntity);
    const review = await reviews.save(
      reviews.create({
        tenantId,
        customerProfileId: customer.id,
        productId: product.id,
        orderId: order.id,
        rating: 5,
        reviewContent: `Dashboard Review ${label}`,
        reviewStatus: tenantId === '1' ? 'published' : 'hidden',
        submittedAt: new Date(),
        publishedAt: tenantId === '1' ? new Date() : null,
      }),
    );
    created.reviewIds.push(review.id);
  }

  async function cleanup() {
    const deleteIds = async (entity: new () => object, ids: string[]) => {
      if (ids.length) await dataSource.getRepository(entity).delete(ids.splice(0));
    };
    await deleteIds(ProductReviewEntity, created.reviewIds);
    await deleteIds(OrderEntity, created.orderIds);
    await deleteIds(InventoryItemEntity, created.inventoryIds);
    await deleteIds(ProductEntity, created.productIds);
    await deleteIds(CustomerProfileEntity, created.customerIds);
    await deleteIds(UserAccountEntity, created.userIds);
  }
});
