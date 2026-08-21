import { createHash } from 'node:crypto';

import { DataSource, In } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import * as cartEntities from '../../src/data/cart/entities';
import { CustomerProfileEntity } from '../../src/data/customer/entities';
import * as customerEntities from '../../src/data/customer/entities';
import { InventoryItemEntity, StockReservationEntity } from '../../src/data/inventory/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { InventoryStockMutationRepository } from '../../src/data/inventory/repositories';
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
import { createTypeOrmOptions } from '../../src/database/typeorm.config';
import { CustomerOwnerResolver } from '../../src/domain/commerce-dependencies/customer-owner.resolver';
import { CustomerOrderService } from '../../src/presentation/order/customer-order.service';

const enabled = process.env.CUSTOMER_ORDER_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Customer Order read MySQL integration', () => {
  let dataSource: DataSource;

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

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('reads persisted COD/VNPAY snapshots with pagination, filters and Customer isolation', async () => {
    const suffix = `${Date.now()}${Math.random().toString(16).slice(2)}`;
    const users = dataSource.getRepository(UserAccountEntity);
    const customers = dataSource.getRepository(CustomerProfileEntity);
    const orders = dataSource.getRepository(OrderEntity);
    const payments = dataSource.getRepository(PaymentEntity);
    const products = dataSource.getRepository(ProductEntity);
    const inventories = dataSource.getRepository(InventoryItemEntity);
    const repository = new TypeOrmOrderRepository(dataSource);
    const createdUsers = await users.save(
      ['a', 'b', 'empty'].map((label) =>
        users.create({
          email: `customer-order-${label}-${suffix}@example.test`,
          normalizedEmail: `customer-order-${label}-${suffix}@example.test`,
          phone: null,
          displayName: `Customer Order ${label}`,
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
          customerCode: `CUS-READ-${index}-${suffix}`,
          fullName: user.displayName,
          contactInfo: { email: user.email },
          customerStatus: 'active',
          consentState: 'unknown',
          marketingOptInStatus: 'not_opted_in',
        }),
      ),
    );
    const ownerResolver = new CustomerOwnerResolver({
      findActiveByUserAccountId: (userAccountId) =>
        customers.findOneBy({ userAccountId, customerStatus: 'active' }),
    });
    const service = new CustomerOrderService(repository, ownerResolver);
    const createdOrderIds: string[] = [];
    const product = await products.save(
      products.create({
        tenantId: '1',
        brandId: null,
        productCode: `READ-${suffix}`,
        productName: 'Persisted snapshot item',
        slug: `read-${suffix}`,
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
        availableQuantity: 10,
        reservedQuantity: 0,
        stockThreshold: 1,
        stockStatus: 'available',
      }),
    );

    try {
      const codOlder = await createOrder(
        repository,
        createdCustomers[0].id,
        createdUsers[0].id,
        product.id,
        {
          suffix: `${suffix}1`,
          method: 'cod',
          total: '50000.00',
        },
      );
      const vnpayPaid = await createOrder(
        repository,
        createdCustomers[0].id,
        createdUsers[0].id,
        product.id,
        {
          suffix: `${suffix}2`,
          method: 'vnpay',
          total: '125000.00',
        },
      );
      const codNewest = await createOrder(
        repository,
        createdCustomers[0].id,
        createdUsers[0].id,
        product.id,
        {
          suffix: `${suffix}3`,
          method: 'cod',
          total: '75000.00',
        },
      );
      const customerBOrder = await createOrder(
        repository,
        createdCustomers[1].id,
        createdUsers[1].id,
        product.id,
        { suffix: `${suffix}4`, method: 'cod', total: '99000.00' },
      );
      createdOrderIds.push(
        codOlder.order.id,
        vnpayPaid.order.id,
        codNewest.order.id,
        customerBOrder.order.id,
      );

      await orders.update(codOlder.order.id, {
        placedAt: new Date('2026-08-01T08:00:00.000Z'),
      });
      await orders.update(vnpayPaid.order.id, {
        placedAt: new Date('2026-08-02T08:00:00.000Z'),
        orderStatus: 'confirmed',
        paymentStatusSnapshot: 'paid',
      });
      await orders.update(codNewest.order.id, {
        placedAt: new Date('2026-08-03T08:00:00.000Z'),
      });
      await payments.update(vnpayPaid.payment.id, {
        paymentStatus: 'paid',
        providerReference: `HHVNP${suffix}`.slice(0, 64),
        paidAt: new Date('2026-08-02T08:05:00.000Z'),
      });
      await dataSource.transaction((manager) =>
        new InventoryStockMutationRepository().consumeForOrder(
          manager,
          vnpayPaid.order.id,
          createdUsers[0].id,
        ),
      );

      await expect(
        service.list(customerActor(createdUsers[2].id), { page: 1, pageSize: 20 }),
      ).resolves.toMatchObject({
        items: [],
        pagination: { totalItems: 0, totalPages: 0 },
      });

      const firstPage = await service.list(customerActor(createdUsers[0].id), {
        page: 1,
        pageSize: 2,
      });
      expect(firstPage.items.map((item) => item.orderId)).toEqual([
        codNewest.order.id,
        vnpayPaid.order.id,
      ]);
      expect(firstPage.pagination).toMatchObject({
        totalItems: 3,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
      });

      await expect(
        service.list(customerActor(createdUsers[0].id), {
          page: 1,
          pageSize: 20,
          orderStatus: 'confirmed',
          paymentStatus: 'paid',
          shippingStatus: 'pending',
          dateFrom: '2026-08-02T00:00:00.000Z',
          dateTo: '2026-08-02T23:59:59.999Z',
        }),
      ).resolves.toMatchObject({
        items: [
          {
            orderId: vnpayPaid.order.id,
            orderStatus: 'confirmed',
            paymentMethod: 'vnpay',
            paymentStatus: 'paid',
            total: '125000.00',
          },
        ],
        pagination: { totalItems: 1 },
      });

      await expect(
        service.detail(customerActor(createdUsers[0].id), codOlder.order.id),
      ).resolves.toMatchObject({
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        total: '50000.00',
        payment: { method: 'cod', status: 'pending', providerReference: null },
        items: [{ productName: 'Persisted snapshot item', quantity: 1 }],
        shippingAddress: { recipientName: 'Nguyễn Văn A', addressLine: '12 Nguyễn Huệ' },
      });
      await expect(
        service.detail(customerActor(createdUsers[0].id), vnpayPaid.order.id),
      ).resolves.toMatchObject({
        paymentMethod: 'vnpay',
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        payment: { status: 'paid', providerReference: expect.stringMatching(/^HHVNP/) },
      });
      await expect(
        service.detail(customerActor(createdUsers[0].id), customerBOrder.order.id),
      ).rejects.toMatchObject({ status: 404, response: { code: 'ORDER.NOT_FOUND' } });
      await expect(service.list(internalActor(), { page: 1, pageSize: 20 })).rejects.toMatchObject({
        status: 403,
        response: { code: 'ORDER.ACCESS_DENIED' },
      });
    } finally {
      if (createdOrderIds.length) {
        const persistedShipments = await dataSource
          .getRepository(ShipmentEntity)
          .find({ where: { orderId: In(createdOrderIds) } });
        if (persistedShipments.length) {
          await dataSource
            .getRepository(ShippingAddressEntity)
            .delete({ shipmentId: In(persistedShipments.map((shipment) => shipment.id)) });
          await dataSource
            .getRepository(ShipmentEntity)
            .delete(persistedShipments.map((shipment) => shipment.id));
        }
        const persistedPayments = await dataSource
          .getRepository(PaymentEntity)
          .find({ where: { orderId: In(createdOrderIds) } });
        if (persistedPayments.length) {
          await dataSource
            .getRepository(PaymentEntity)
            .delete(persistedPayments.map((item) => item.id));
        }
        const persistedItems = await dataSource
          .getRepository(OrderItemEntity)
          .find({ where: { orderId: In(createdOrderIds) } });
        if (persistedItems.length) {
          await dataSource
            .getRepository(OrderItemEntity)
            .delete(persistedItems.map((item) => item.id));
        }
        await dataSource
          .getRepository(StockReservationEntity)
          .delete({ orderId: In(createdOrderIds) });
        await dataSource.getRepository(OrderEntity).delete(createdOrderIds);
      }
      await inventories.delete(inventory.id);
      await products.delete(product.id);
      await customers.delete(createdCustomers.map((item) => item.id));
      await users.delete(createdUsers.map((item) => item.id));
    }
  });
});

async function createOrder(
  repository: TypeOrmOrderRepository,
  customerProfileId: string,
  userAccountId: string,
  productId: string,
  input: { suffix: string; method: 'cod' | 'vnpay'; total: string },
) {
  return repository.createSnapshot({
    customerProfileId,
    cartId: null,
    orderCode: `HHREAD${input.suffix}`.slice(0, 64),
    orderTotal: input.total,
    idempotencyKeyHash: hash(`key-${input.suffix}`),
    requestHash: hash(`request-${input.suffix}`),
    actorUserAccountId: userAccountId,
    items: [
      {
        productId,
        productName: 'Persisted snapshot item',
        sku: `READ${input.suffix}`.slice(0, 64),
        unitPrice: input.total,
        quantity: 1,
        lineTotal: input.total,
      },
    ],
    payment: { method: input.method, amount: input.total, status: 'pending' },
    shipping: {
      method: 'manual',
      fee: '0.00',
      address: {
        recipientName: 'Nguyễn Văn A',
        phone: '0901234567',
        addressText: JSON.stringify({
          countryCode: 'VN',
          provinceCity: 'Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Bến Nghé',
          addressLine: '12 Nguyễn Huệ',
        }),
        note: null,
      },
    },
  });
}

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

function internalActor() {
  return {
    userAccountId: 'internal-user',
    sessionId: '2',
    sessionPublicId: 'internal-session',
    roles: ['STAFF'] as const,
    permissionsVersion: 1,
  };
}
