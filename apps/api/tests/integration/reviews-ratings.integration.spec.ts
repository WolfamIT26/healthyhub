import { DataSource, In } from 'typeorm';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import * as cartEntities from '../../src/data/cart/entities';
import { CustomerProfileEntity } from '../../src/data/customer/entities';
import * as customerEntities from '../../src/data/customer/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { OrderEntity, OrderItemEntity } from '../../src/data/order/entities';
import * as orderEntities from '../../src/data/order/entities';
import * as paymentEntities from '../../src/data/payment/entities';
import { ProductEntity } from '../../src/data/product/entities';
import * as productEntities from '../../src/data/product/entities';
import { ProductReviewEntity } from '../../src/data/review/entities';
import * as reviewEntities from '../../src/data/review/entities';
import { TypeOrmReviewRepository } from '../../src/data/review/repositories';
import { ShipmentEntity } from '../../src/data/shipping/entities';
import * as shippingEntities from '../../src/data/shipping/entities';
import { UserAccountEntity } from '../../src/data/user/entities';
import * as userEntities from '../../src/data/user/entities';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';
import { ReviewEligibilityPolicy } from '../../src/domain/review/review-eligibility.policy';

const enabled = process.env.REVIEW_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Reviews and ratings MySQL integration', () => {
  let dataSource: DataSource;
  let repository: TypeOrmReviewRepository;
  const createdReviewIds: string[] = [];
  const createdOrderIds: string[] = [];
  const createdProductIds: string[] = [];
  const createdCustomerIds: string[] = [];
  const createdUserIds: string[] = [];

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
    repository = new TypeOrmReviewRepository(dataSource, new ReviewEligibilityPolicy());
  });

  afterEach(async () => cleanup());
  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('serializes concurrent create, returns exact retry and rejects conflicting identity', async () => {
    const fixture = await createFixture('concurrent', 'completed');
    const command = {
      customerProfileId: fixture.customers[0].id,
      actorUserAccountId: fixture.users[0].id,
      orderId: fixture.order.id,
      productId: fixture.products[0].id,
      rating: 5,
      content: 'Review concurrency hợp lệ',
    };

    const concurrent = await Promise.all([repository.create(command), repository.create(command)]);
    expect(concurrent.map((result) => result.outcome).sort()).toEqual(['created', 'idempotent']);
    const persisted = await dataSource.getRepository(ProductReviewEntity).findBy({
      orderId: fixture.order.id,
      productId: fixture.products[0].id,
    });
    createdReviewIds.push(...persisted.map((review) => review.id));
    expect(persisted).toHaveLength(1);

    await expect(repository.create({ ...command, rating: 4 })).resolves.toEqual({
      outcome: 'duplicate',
    });
  });

  it('fails closed for foreign owner, Product outside Order and unfinished fulfillment', async () => {
    const completed = await createFixture('authority', 'completed');
    const pending = await createFixture('pending', 'pending');
    const base = {
      actorUserAccountId: completed.users[0].id,
      orderId: completed.order.id,
      productId: completed.products[0].id,
      rating: 5,
      content: 'Không được ghi',
    };

    await expect(
      repository.create({ ...base, customerProfileId: completed.customers[1].id }),
    ).resolves.toEqual({
      outcome: 'ineligible',
      reason: 'ORDER_NOT_FOUND_OR_NOT_OWNED',
    });
    await expect(
      repository.create({
        ...base,
        customerProfileId: completed.customers[0].id,
        productId: completed.products[1].id,
      }),
    ).resolves.toEqual({ outcome: 'ineligible', reason: 'PRODUCT_NOT_IN_ORDER' });
    await expect(
      repository.create({
        ...base,
        customerProfileId: pending.customers[0].id,
        actorUserAccountId: pending.users[0].id,
        orderId: pending.order.id,
        productId: pending.products[0].id,
      }),
    ).resolves.toEqual({ outcome: 'ineligible', reason: 'FULFILLMENT_NOT_COMPLETED' });
    expect(await dataSource.getRepository(ProductReviewEntity).count()).toBe(0);
  });

  it('uses active published persistence for list, pagination, average and distribution', async () => {
    const first = await createFixture('aggregate-a', 'completed');
    const second = await createFixture('aggregate-b', 'completed');
    const third = await createFixture('aggregate-c', 'completed');
    const commands = [
      { fixture: first, rating: 5, content: 'Năm sao' },
      { fixture: second, rating: 4, content: 'Bốn sao' },
      { fixture: third, rating: 1, content: 'Một sao rồi xóa' },
    ];
    for (const item of commands) {
      const result = await repository.create({
        customerProfileId: item.fixture.customers[0].id,
        actorUserAccountId: item.fixture.users[0].id,
        orderId: item.fixture.order.id,
        productId: first.products[0].id,
        rating: item.rating,
        content: item.content,
      });
      if (result.outcome === 'created') createdReviewIds.push(result.review.id);
    }
    // Fixtures b/c ordered their own Product, so add the aggregate Product to those Orders.
    // Commands above intentionally fail membership until the canonical Order Item is persisted.
    expect(createdReviewIds).toHaveLength(1);
    for (const fixture of [second, third]) {
      await addOrderProduct(fixture.order.id, first.products[0]);
      const item = commands.find((candidate) => candidate.fixture === fixture)!;
      const result = await repository.create({
        customerProfileId: fixture.customers[0].id,
        actorUserAccountId: fixture.users[0].id,
        orderId: fixture.order.id,
        productId: first.products[0].id,
        rating: item.rating,
        content: item.content,
      });
      if (result.outcome === 'created') createdReviewIds.push(result.review.id);
    }
    await repository.deleteOwned({
      customerProfileId: third.customers[0].id,
      actorUserAccountId: third.users[0].id,
      reviewId: createdReviewIds[2],
    });

    const publicPage = await repository.listPublic(first.products[0].id, 0, 1);
    expect(publicPage.total).toBe(2);
    expect(publicPage.rows).toHaveLength(1);
    await expect(repository.summarizePublic(first.products[0].id)).resolves.toEqual({
      averageRating: 4.5,
      totalReviews: 2,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 },
    });

    const hidden = await dataSource.getRepository(ProductReviewEntity).findOneByOrFail({
      id: createdReviewIds[1],
    });
    hidden.reviewStatus = 'hidden';
    await dataSource.getRepository(ProductReviewEntity).save(hidden);
    expect((await repository.listPublic(first.products[0].id, 0, 10)).total).toBe(1);
    await expect(repository.summarizePublic(first.products[0].id)).resolves.toEqual({
      averageRating: 5,
      totalReviews: 1,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 },
    });
  });

  it('allows owner update/delete, hides ownership boundaries and retains identity after delete', async () => {
    const fixture = await createFixture('ownership', 'completed');
    const created = await repository.create({
      customerProfileId: fixture.customers[0].id,
      actorUserAccountId: fixture.users[0].id,
      orderId: fixture.order.id,
      productId: fixture.products[0].id,
      rating: 5,
      content: 'Nội dung ban đầu',
    });
    if (created.outcome !== 'created') throw new Error('Expected Review fixture.');
    createdReviewIds.push(created.review.id);

    await expect(
      repository.updateOwned({
        customerProfileId: fixture.customers[1].id,
        actorUserAccountId: fixture.users[1].id,
        reviewId: created.review.id,
        rating: 1,
      }),
    ).resolves.toBeNull();
    await expect(
      repository.updateOwned({
        customerProfileId: fixture.customers[0].id,
        actorUserAccountId: fixture.users[0].id,
        reviewId: created.review.id,
        rating: 4,
        content: 'Nội dung đã sửa',
      }),
    ).resolves.toMatchObject({ rating: 4, reviewContent: 'Nội dung đã sửa' });

    await repository.deleteOwned({
      customerProfileId: fixture.customers[0].id,
      actorUserAccountId: fixture.users[0].id,
      reviewId: created.review.id,
    });
    await expect(
      repository.deleteOwned({
        customerProfileId: fixture.customers[0].id,
        actorUserAccountId: fixture.users[0].id,
        reviewId: created.review.id,
      }),
    ).resolves.toEqual({ found: true, reviewId: created.review.id });
    await expect(
      repository.create({
        customerProfileId: fixture.customers[0].id,
        actorUserAccountId: fixture.users[0].id,
        orderId: fixture.order.id,
        productId: fixture.products[0].id,
        rating: 5,
        content: 'Không tạo identity mới',
      }),
    ).resolves.toEqual({ outcome: 'duplicate' });
    expect((await repository.listPublic(fixture.products[0].id, 0, 10)).total).toBe(0);
  });

  it('serializes an owner update/delete race and ends soft-deleted', async () => {
    const fixture = await createFixture('mutation-race', 'completed');
    const created = await repository.create({
      customerProfileId: fixture.customers[0].id,
      actorUserAccountId: fixture.users[0].id,
      orderId: fixture.order.id,
      productId: fixture.products[0].id,
      rating: 5,
      content: 'Nội dung trước race',
    });
    if (created.outcome !== 'created') throw new Error('Expected Review fixture.');
    createdReviewIds.push(created.review.id);

    const [updated, deleted] = await Promise.all([
      repository.updateOwned({
        customerProfileId: fixture.customers[0].id,
        actorUserAccountId: fixture.users[0].id,
        reviewId: created.review.id,
        rating: 4,
        content: 'Nội dung trong race',
      }),
      repository.deleteOwned({
        customerProfileId: fixture.customers[0].id,
        actorUserAccountId: fixture.users[0].id,
        reviewId: created.review.id,
      }),
    ]);
    expect(updated === null || updated.rating === 4).toBe(true);
    expect(deleted).toEqual({ found: true, reviewId: created.review.id });
    const persisted = await dataSource.getRepository(ProductReviewEntity).findOne({
      where: { id: created.review.id },
      withDeleted: true,
    });
    expect(persisted?.deletedAt).toBeInstanceOf(Date);
    expect((await repository.listPublic(fixture.products[0].id, 0, 10)).total).toBe(0);
  });

  it('revokes verified evidence after return while retaining published content', async () => {
    const fixture = await createFixture('return', 'completed');
    const created = await repository.create({
      customerProfileId: fixture.customers[0].id,
      actorUserAccountId: fixture.users[0].id,
      orderId: fixture.order.id,
      productId: fixture.products[0].id,
      rating: 5,
      content: 'Content survives return',
    });
    if (created.outcome !== 'created') throw new Error('Expected Review fixture.');
    createdReviewIds.push(created.review.id);
    expect((await repository.listPublic(fixture.products[0].id, 0, 10)).rows[0]).toMatchObject({
      verifiedPurchase: true,
    });

    fixture.order.orderStatus = 'returned';
    fixture.shipment.shippingStatus = 'returned';
    await dataSource.getRepository(OrderEntity).save(fixture.order);
    await dataSource.getRepository(ShipmentEntity).save(fixture.shipment);

    const result = await repository.listPublic(fixture.products[0].id, 0, 10);
    expect(result.rows[0]).toMatchObject({
      verifiedPurchase: false,
      review: { reviewContent: 'Content survives return' },
    });
  });

  it('rolls back Review insert when an audit FK fails', async () => {
    const fixture = await createFixture('rollback', 'completed');
    await expect(
      repository.create({
        customerProfileId: fixture.customers[0].id,
        actorUserAccountId: '999999999999',
        orderId: fixture.order.id,
        productId: fixture.products[0].id,
        rating: 5,
        content: 'Transaction phải rollback',
      }),
    ).rejects.toBeTruthy();
    expect(
      await dataSource.getRepository(ProductReviewEntity).countBy({ orderId: fixture.order.id }),
    ).toBe(0);
  });

  async function createFixture(label: string, status: 'completed' | 'pending') {
    const suffix = `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const users = await dataSource.getRepository(UserAccountEntity).save(
      ['a', 'b'].map((actor) =>
        dataSource.getRepository(UserAccountEntity).create({
          email: `review-${actor}-${suffix}@example.test`,
          normalizedEmail: `review-${actor}-${suffix}@example.test`,
          phone: null,
          displayName: `Review ${actor}`,
          passwordHash: 'integration-fixture-not-a-login-secret',
          userStatus: 'active',
          emailVerifiedAt: new Date(),
          lockedUntil: null,
          lastLoginAt: null,
        }),
      ),
    );
    createdUserIds.push(...users.map((user) => user.id));
    const customers = await dataSource.getRepository(CustomerProfileEntity).save(
      users.map((user, index) =>
        dataSource.getRepository(CustomerProfileEntity).create({
          tenantId: '1',
          userAccountId: user.id,
          customerCode: `CUS-REV-${index}-${suffix}`.slice(0, 64),
          fullName: user.displayName,
          contactInfo: null,
          customerStatus: 'active',
          consentState: 'unknown',
          marketingOptInStatus: 'not_opted_in',
        }),
      ),
    );
    createdCustomerIds.push(...customers.map((customer) => customer.id));
    const products = await dataSource.getRepository(ProductEntity).save(
      ['ordered', 'other'].map((kind) =>
        dataSource.getRepository(ProductEntity).create({
          tenantId: '1',
          brandId: null,
          productCode: `REV-${kind}-${suffix}`.slice(0, 64),
          productName: `Review ${kind}`,
          slug: `review-${kind}-${suffix}`.slice(0, 191),
          basePrice: '100000.00',
          sellableStatus: 'sellable',
          productVisibility: 'public',
          productStatus: 'active',
        }),
      ),
    );
    createdProductIds.push(...products.map((product) => product.id));
    const now = new Date();
    const order = await dataSource.getRepository(OrderEntity).save(
      dataSource.getRepository(OrderEntity).create({
        tenantId: '1',
        customerProfileId: customers[0].id,
        cartId: null,
        orderCode: `HH-REV-${suffix}`.slice(0, 64),
        orderSource: 'web',
        orderStatus: status === 'completed' ? 'completed' : 'new',
        paymentStatusSnapshot: 'pending',
        shippingStatusSnapshot: status === 'completed' ? 'delivered' : 'pending',
        orderTotal: '100000.00',
        idempotencyKeyHash: `${'a'.repeat(32)}${createdOrderIds.length.toString().padStart(32, '0')}`,
        requestHash: `${'b'.repeat(32)}${createdOrderIds.length.toString().padStart(32, '0')}`,
        placedAt: new Date(now.getTime() - 1_000),
        completedAt: status === 'completed' ? now : null,
        createdBy: users[0].id,
        updatedBy: users[0].id,
      }),
    );
    createdOrderIds.push(order.id);
    await addOrderProduct(order.id, products[0]);
    const shipment = await dataSource.getRepository(ShipmentEntity).save(
      dataSource.getRepository(ShipmentEntity).create({
        tenantId: '1',
        orderId: order.id,
        shippingMethod: 'manual',
        shippingFee: '0.00',
        shippingStatus: status === 'completed' ? 'delivered' : 'pending',
        trackingReference: null,
        shippedAt: status === 'completed' ? now : null,
        deliveredAt: status === 'completed' ? now : null,
        createdBy: users[0].id,
        updatedBy: users[0].id,
      }),
    );
    return { users, customers, products, order, shipment };
  }

  async function addOrderProduct(orderId: string, product: ProductEntity) {
    await dataSource.getRepository(OrderItemEntity).save(
      dataSource.getRepository(OrderItemEntity).create({
        tenantId: '1',
        orderId,
        productId: product.id,
        productNameSnapshot: product.productName,
        skuSnapshot: product.productCode,
        unitPriceSnapshot: product.basePrice,
        quantity: 1,
        lineTotal: product.basePrice,
        itemStatus: 'active',
      }),
    );
  }

  async function cleanup() {
    if (createdReviewIds.length)
      await dataSource.getRepository(ProductReviewEntity).delete(createdReviewIds);
    if (createdOrderIds.length) {
      await dataSource.getRepository(ShipmentEntity).delete({ orderId: In(createdOrderIds) });
      await dataSource.getRepository(OrderItemEntity).delete({ orderId: In(createdOrderIds) });
      await dataSource.getRepository(OrderEntity).delete(createdOrderIds);
    }
    if (createdProductIds.length)
      await dataSource.getRepository(ProductEntity).delete(createdProductIds);
    if (createdCustomerIds.length)
      await dataSource.getRepository(CustomerProfileEntity).delete(createdCustomerIds);
    if (createdUserIds.length)
      await dataSource.getRepository(UserAccountEntity).delete(createdUserIds);
    createdReviewIds.length = 0;
    createdOrderIds.length = 0;
    createdProductIds.length = 0;
    createdCustomerIds.length = 0;
    createdUserIds.length = 0;
  }
});
