import { createHash } from 'node:crypto';

import { DataSource, In } from 'typeorm';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import * as cartEntities from '../../src/data/cart/entities';
import { CustomerProfileEntity } from '../../src/data/customer/entities';
import * as customerEntities from '../../src/data/customer/entities';
import { InventoryItemEntity, StockReservationEntity } from '../../src/data/inventory/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { InventoryStockMutationRepository } from '../../src/data/inventory/repositories';
import {
  OrderEntity,
  OrderItemEntity,
  OrderStatusHistoryEntity,
} from '../../src/data/order/entities';
import * as orderEntities from '../../src/data/order/entities';
import {
  TypeOrmOrderFulfillmentRepository,
  TypeOrmOrderRepository,
} from '../../src/data/order/repositories';
import { PaymentEntity } from '../../src/data/payment/entities';
import * as paymentEntities from '../../src/data/payment/entities';
import { ProductEntity } from '../../src/data/product/entities';
import * as productEntities from '../../src/data/product/entities';
import { TypeOrmReviewEligibilityRepository } from '../../src/data/review/repositories';
import {
  ShipmentEntity,
  ShippingAddressEntity,
  ShippingStatusHistoryEntity,
} from '../../src/data/shipping/entities';
import * as shippingEntities from '../../src/data/shipping/entities';
import { UserAccountEntity } from '../../src/data/user/entities';
import * as userEntities from '../../src/data/user/entities';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';
import { CustomerOwnerResolver } from '../../src/domain/commerce-dependencies/customer-owner.resolver';
import { OrderFulfillmentPolicy } from '../../src/domain/order/order-fulfillment.policy';
import { OrderFulfillmentService } from '../../src/domain/order/order-fulfillment.service';
import { ReviewEligibilityPolicy } from '../../src/domain/review/review-eligibility.policy';
import { ReviewEligibilityService } from '../../src/domain/review/review-eligibility.service';

const enabled = process.env.FULFILLMENT_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Order fulfillment and Review eligibility MySQL integration', () => {
  let dataSource: DataSource;
  const createdOrderIds: string[] = [];
  const createdInventoryIds: string[] = [];
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
        ...Object.values(shippingEntities),
        ...Object.values(userEntities),
      ],
    });
    await dataSource.initialize();
  });

  afterEach(async () => {
    await cleanup();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('fulfills COD, persists delivery evidence, is idempotent and revokes eligibility on return', async () => {
    const fixture = await createFixture('cod-lifecycle');
    const order = await createOrder(fixture, 'cod');
    const fulfillment = createFulfillmentService();
    const reviews = createReviewService(fixture.customers);
    const shippedAt = new Date(order.order.placedAt.getTime() + 1_000);
    const deliveredAt = new Date(order.order.placedAt.getTime() + 2_000);
    const returnedAt = new Date(order.order.placedAt.getTime() + 3_000);

    await expect(
      reviews.evaluate(customerActor(fixture.users[0].id), order.order.id, fixture.product.id),
    ).resolves.toEqual({ eligible: false, reason: 'FULFILLMENT_NOT_COMPLETED' });
    await expect(
      fulfillment.markDelivered({ orderId: order.order.id, occurredAt: deliveredAt }),
    ).rejects.toMatchObject({ code: 'ORDER_FULFILLMENT_INVALID_TRANSITION' });

    await expect(
      fulfillment.markShipped({ orderId: order.order.id, occurredAt: shippedAt }),
    ).resolves.toMatchObject({ outcome: 'changed', orderStatus: 'new', shippingStatus: 'shipped' });
    await expect(
      fulfillment.markShipped({ orderId: order.order.id, occurredAt: shippedAt }),
    ).resolves.toMatchObject({ outcome: 'idempotent' });
    await expect(
      fulfillment.cancelBeforeShipment({ orderId: order.order.id, reason: 'Too late' }),
    ).rejects.toMatchObject({ code: 'ORDER_FULFILLMENT_INVALID_TRANSITION' });
    await expect(
      fulfillment.markDelivered({ orderId: order.order.id, occurredAt: deliveredAt }),
    ).resolves.toMatchObject({
      outcome: 'changed',
      orderStatus: 'completed',
      shippingStatus: 'delivered',
      deliveredAt,
      completedAt: deliveredAt,
    });
    await expect(
      fulfillment.markDelivered({ orderId: order.order.id, occurredAt: deliveredAt }),
    ).resolves.toMatchObject({ outcome: 'idempotent' });

    const persistedOrder = await dataSource
      .getRepository(OrderEntity)
      .findOneByOrFail({ id: order.order.id });
    const persistedShipment = await dataSource
      .getRepository(ShipmentEntity)
      .findOneByOrFail({ orderId: order.order.id });
    expect(persistedOrder).toMatchObject({
      orderStatus: 'completed',
      shippingStatusSnapshot: 'delivered',
      completedAt: deliveredAt,
    });
    expect(persistedShipment).toMatchObject({
      shippingStatus: 'delivered',
      shippedAt,
      deliveredAt,
    });
    await expect(
      reviews.evaluate(customerActor(fixture.users[0].id), order.order.id, fixture.product.id),
    ).resolves.toEqual({
      eligible: true,
      duplicateIdentity: 'order_product',
      identity: { orderId: order.order.id, productId: fixture.product.id },
    });
    await expect(
      reviews.evaluate(customerActor(fixture.users[1].id), order.order.id, fixture.product.id),
    ).resolves.toEqual({ eligible: false, reason: 'ORDER_NOT_FOUND_OR_NOT_OWNED' });
    await expect(
      reviews.evaluate(customerActor(fixture.users[0].id), order.order.id, fixture.otherProduct.id),
    ).resolves.toEqual({ eligible: false, reason: 'PRODUCT_NOT_IN_ORDER' });

    await expect(
      fulfillment.markReturned({
        orderId: order.order.id,
        reason: 'Authoritative full return',
        occurredAt: returnedAt,
      }),
    ).resolves.toMatchObject({ outcome: 'changed', orderStatus: 'returned' });
    await expect(
      fulfillment.markReturned({ orderId: order.order.id, reason: 'Authoritative full return' }),
    ).resolves.toMatchObject({ outcome: 'idempotent' });
    await expect(
      reviews.evaluate(customerActor(fixture.users[0].id), order.order.id, fixture.product.id),
    ).resolves.toEqual({ eligible: false, reason: 'FULFILLMENT_REVOKED' });
    expect(
      await dataSource
        .getRepository(InventoryItemEntity)
        .findOneByOrFail({ id: fixture.inventory.id }),
    ).toMatchObject({ availableQuantity: 20, reservedQuantity: 0 });
    expect(
      await dataSource
        .getRepository(StockReservationEntity)
        .findOneByOrFail({ orderId: order.order.id }),
    ).toMatchObject({ reservationStatus: 'restocked', restockedAt: expect.any(Date) });
    expect(
      await dataSource
        .getRepository(ShippingStatusHistoryEntity)
        .countBy({ shipmentId: order.shipment.id }),
    ).toBe(3);
    expect(
      await dataSource.getRepository(OrderStatusHistoryEntity).countBy({ orderId: order.order.id }),
    ).toBe(2);
  });

  it('keeps VNPAY paid separate from delivered and rejects fulfillment before verified payment', async () => {
    const fixture = await createFixture('vnpay-lifecycle');
    const order = await createOrder(fixture, 'vnpay');
    const fulfillment = createFulfillmentService();
    const reviews = createReviewService(fixture.customers);

    await expect(fulfillment.markShipped({ orderId: order.order.id })).rejects.toMatchObject({
      code: 'ORDER_FULFILLMENT_PAYMENT_NOT_READY',
    });
    await confirmVnpayPayment(order.order.id, fixture.users[0].id);
    await expect(
      reviews.evaluate(customerActor(fixture.users[0].id), order.order.id, fixture.product.id),
    ).resolves.toEqual({ eligible: false, reason: 'FULFILLMENT_NOT_COMPLETED' });
    await fulfillment.markShipped({ orderId: order.order.id });
    await fulfillment.markDelivered({ orderId: order.order.id });
    await expect(
      reviews.evaluate(customerActor(fixture.users[0].id), order.order.id, fixture.product.id),
    ).resolves.toMatchObject({ eligible: true });
  });

  it('serializes concurrent duplicate shipment transitions', async () => {
    const fixture = await createFixture('concurrent-transition');
    const order = await createOrder(fixture, 'cod');
    const fulfillment = createFulfillmentService();
    const occurredAt = new Date(order.order.placedAt.getTime() + 1_000);

    const results = await Promise.all([
      fulfillment.markShipped({ orderId: order.order.id, occurredAt }),
      fulfillment.markShipped({ orderId: order.order.id, occurredAt }),
    ]);
    expect(results.map((result) => result.outcome).sort()).toEqual(['changed', 'idempotent']);
    expect(
      await dataSource
        .getRepository(ShippingStatusHistoryEntity)
        .countBy({ shipmentId: order.shipment.id }),
    ).toBe(1);
  });

  it('cancels only before shipment and restores active or consumed stock exactly once', async () => {
    const fixture = await createFixture('cancel-stock');
    const cod = await createOrder(fixture, 'cod');
    const pendingVnpay = await createOrder(fixture, 'vnpay');
    const paidVnpay = await createOrder(fixture, 'vnpay');
    const fulfillment = createFulfillmentService();

    await confirmVnpayPayment(paidVnpay.order.id, fixture.users[0].id);

    await fulfillment.cancelBeforeShipment({
      orderId: cod.order.id,
      reason: 'COD cancelled before shipment',
    });
    await fulfillment.cancelBeforeShipment({
      orderId: pendingVnpay.order.id,
      reason: 'VNPAY cancelled before payment/shipment',
    });
    await fulfillment.cancelBeforeShipment({
      orderId: paidVnpay.order.id,
      reason: 'Paid VNPAY cancelled before shipment; refund reconciliation required',
    });
    await expect(
      fulfillment.cancelBeforeShipment({ orderId: cod.order.id, reason: 'Retry' }),
    ).resolves.toMatchObject({ outcome: 'idempotent' });

    expect(
      await dataSource
        .getRepository(InventoryItemEntity)
        .findOneByOrFail({ id: fixture.inventory.id }),
    ).toMatchObject({ availableQuantity: 20, reservedQuantity: 0 });
    expect(
      await dataSource
        .getRepository(PaymentEntity)
        .findOneByOrFail({ orderId: paidVnpay.order.id }),
    ).toMatchObject({ paymentStatus: 'paid' });
    const reservations = await dataSource.getRepository(StockReservationEntity).find({
      where: { orderId: In([cod.order.id, pendingVnpay.order.id, paidVnpay.order.id]) },
      order: { orderId: 'ASC' },
    });
    expect(reservations.map((reservation) => reservation.reservationStatus).sort()).toEqual([
      'released',
      'restocked',
      'restocked',
    ]);
  });

  it('rolls back stock restore and statuses when fulfillment history persistence fails', async () => {
    const fixture = await createFixture('fulfillment-rollback');
    const order = await createOrder(fixture, 'cod');
    const fulfillment = createFulfillmentService();

    await expect(
      fulfillment.cancelBeforeShipment({
        orderId: order.order.id,
        actorUserAccountId: '999999999999',
        reason: 'Force missing audit actor FK',
      }),
    ).rejects.toBeTruthy();

    expect(
      await dataSource.getRepository(OrderEntity).findOneByOrFail({ id: order.order.id }),
    ).toMatchObject({ orderStatus: 'new', shippingStatusSnapshot: 'pending' });
    expect(
      await dataSource.getRepository(ShipmentEntity).findOneByOrFail({ orderId: order.order.id }),
    ).toMatchObject({ shippingStatus: 'pending' });
    expect(
      await dataSource
        .getRepository(InventoryItemEntity)
        .findOneByOrFail({ id: fixture.inventory.id }),
    ).toMatchObject({ availableQuantity: 19, reservedQuantity: 0 });
    expect(
      await dataSource
        .getRepository(StockReservationEntity)
        .findOneByOrFail({ orderId: order.order.id }),
    ).toMatchObject({ reservationStatus: 'consumed', restockedAt: null });
    expect(
      await dataSource
        .getRepository(ShippingStatusHistoryEntity)
        .countBy({ shipmentId: order.shipment.id }),
    ).toBe(0);
    expect(
      await dataSource.getRepository(OrderStatusHistoryEntity).countBy({ orderId: order.order.id }),
    ).toBe(0);
  });

  function createFulfillmentService() {
    return new OrderFulfillmentService(
      new TypeOrmOrderFulfillmentRepository(
        dataSource,
        new OrderFulfillmentPolicy(),
        new InventoryStockMutationRepository(),
      ),
    );
  }

  function createReviewService(customers: ReturnType<DataSource['getRepository']>) {
    const owners = new CustomerOwnerResolver({
      findActiveByUserAccountId: (userAccountId) =>
        customers.findOneBy({ userAccountId, customerStatus: 'active' }),
    } as never);
    return new ReviewEligibilityService(
      owners,
      new TypeOrmReviewEligibilityRepository(dataSource),
      new ReviewEligibilityPolicy(),
    );
  }

  async function createFixture(label: string) {
    const suffix = `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const users = dataSource.getRepository(UserAccountEntity);
    const customers = dataSource.getRepository(CustomerProfileEntity);
    const products = dataSource.getRepository(ProductEntity);
    const inventories = dataSource.getRepository(InventoryItemEntity);
    const createdUsers = await users.save(
      ['a', 'b'].map((actor) =>
        users.create({
          email: `fulfillment-${actor}-${suffix}@example.test`,
          normalizedEmail: `fulfillment-${actor}-${suffix}@example.test`,
          phone: null,
          displayName: `Fulfillment ${actor}`,
          passwordHash: 'integration-fixture-not-a-login-secret',
          userStatus: 'active',
          emailVerifiedAt: new Date(),
          lockedUntil: null,
          lastLoginAt: null,
        }),
      ),
    );
    createdUserIds.push(...createdUsers.map((user) => user.id));
    const createdCustomers = await customers.save(
      createdUsers.map((user, index) =>
        customers.create({
          tenantId: '1',
          userAccountId: user.id,
          customerCode: `CUS-FUL-${index}-${suffix}`.slice(0, 64),
          fullName: user.displayName,
          contactInfo: { email: user.email },
          customerStatus: 'active',
          consentState: 'unknown',
          marketingOptInStatus: 'not_opted_in',
        }),
      ),
    );
    createdCustomerIds.push(...createdCustomers.map((customer) => customer.id));
    const createdProducts = await products.save(
      ['ordered', 'other'].map((kind) =>
        products.create({
          tenantId: '1',
          brandId: null,
          productCode: `FUL-${kind}-${suffix}`.slice(0, 64),
          productName: `Fulfillment ${kind}`,
          slug: `fulfillment-${kind}-${suffix}`.slice(0, 191),
          basePrice: '100000.00',
          sellableStatus: 'sellable',
          productVisibility: 'public',
          productStatus: 'active',
        }),
      ),
    );
    createdProductIds.push(...createdProducts.map((product) => product.id));
    const inventory = await inventories.save(
      inventories.create({
        tenantId: '1',
        productId: createdProducts[0].id,
        availableQuantity: 20,
        reservedQuantity: 0,
        stockThreshold: 2,
        stockStatus: 'available',
      }),
    );
    createdInventoryIds.push(inventory.id);
    return {
      suffix,
      users: createdUsers,
      customers,
      customerProfiles: createdCustomers,
      product: createdProducts[0],
      otherProduct: createdProducts[1],
      inventory,
    };
  }

  async function createOrder(
    fixture: Awaited<ReturnType<typeof createFixture>>,
    method: 'cod' | 'vnpay',
  ) {
    const suffix = `${fixture.suffix}-${method}-${createdOrderIds.length}`;
    const aggregate = await new TypeOrmOrderRepository(dataSource).createSnapshot({
      customerProfileId: fixture.customerProfiles[0].id,
      cartId: null as never,
      orderCode: `HH-FUL-${suffix}`.slice(0, 64),
      orderTotal: '100000.00',
      idempotencyKeyHash: hash(`key-${suffix}`),
      requestHash: hash(`request-${suffix}`),
      actorUserAccountId: fixture.users[0].id,
      items: [
        {
          productId: fixture.product.id,
          productName: fixture.product.productName,
          sku: fixture.product.productCode,
          unitPrice: fixture.product.basePrice,
          quantity: 1,
          lineTotal: fixture.product.basePrice,
        },
      ],
      payment: { method, amount: '100000.00', status: 'pending' },
      shipping: {
        method: 'manual',
        fee: '0.00',
        address: {
          recipientName: 'Nguyễn Văn A',
          phone: '0901234567',
          addressText: JSON.stringify({ addressLine: '12 Nguyễn Huệ' }),
          note: null,
        },
      },
    });
    createdOrderIds.push(aggregate.order.id);
    return aggregate;
  }

  async function confirmVnpayPayment(orderId: string, actorUserAccountId: string) {
    await dataSource.transaction(async (manager) => {
      const payment = await manager.getRepository(PaymentEntity).findOne({
        where: { tenantId: '1', orderId },
        lock: { mode: 'pessimistic_write' },
      });
      const order = await manager.getRepository(OrderEntity).findOne({
        where: { tenantId: '1', id: orderId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!payment || !order) throw new Error('Missing VNPAY fixture aggregate.');
      await new InventoryStockMutationRepository().consumeForOrder(
        manager,
        orderId,
        actorUserAccountId,
      );
      payment.paymentStatus = 'paid';
      payment.paidAt = new Date();
      order.paymentStatusSnapshot = 'paid';
      order.orderStatus = 'confirmed';
      await manager.getRepository(PaymentEntity).save(payment);
      await manager.getRepository(OrderEntity).save(order);
    });
  }

  async function cleanup() {
    if (createdOrderIds.length) {
      const shipments = await dataSource
        .getRepository(ShipmentEntity)
        .find({ where: { orderId: In(createdOrderIds) } });
      if (shipments.length) {
        const shipmentIds = shipments.map((shipment) => shipment.id);
        await dataSource
          .getRepository(ShippingStatusHistoryEntity)
          .delete({ shipmentId: In(shipmentIds) });
        await dataSource
          .getRepository(ShippingAddressEntity)
          .delete({ shipmentId: In(shipmentIds) });
      }
      await dataSource
        .getRepository(OrderStatusHistoryEntity)
        .delete({ orderId: In(createdOrderIds) });
      await dataSource.getRepository(ShipmentEntity).delete({ orderId: In(createdOrderIds) });
      await dataSource.getRepository(PaymentEntity).delete({ orderId: In(createdOrderIds) });
      await dataSource.getRepository(OrderItemEntity).delete({ orderId: In(createdOrderIds) });
      await dataSource
        .getRepository(StockReservationEntity)
        .delete({ orderId: In(createdOrderIds) });
      await dataSource.getRepository(OrderEntity).delete(createdOrderIds);
    }
    if (createdInventoryIds.length)
      await dataSource.getRepository(InventoryItemEntity).delete(createdInventoryIds);
    if (createdProductIds.length)
      await dataSource.getRepository(ProductEntity).delete(createdProductIds);
    if (createdCustomerIds.length)
      await dataSource.getRepository(CustomerProfileEntity).delete(createdCustomerIds);
    if (createdUserIds.length)
      await dataSource.getRepository(UserAccountEntity).delete(createdUserIds);
    createdOrderIds.length = 0;
    createdInventoryIds.length = 0;
    createdProductIds.length = 0;
    createdCustomerIds.length = 0;
    createdUserIds.length = 0;
  }
});

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function customerActor(userAccountId: string) {
  return {
    userAccountId,
    sessionId: '1',
    sessionPublicId: `session-${userAccountId}`,
    roles: ['CUSTOMER'] as const,
    permissionsVersion: 1,
  };
}
