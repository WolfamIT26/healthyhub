import { GUARDS_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import { OrderEntity, OrderItemEntity } from '../../data/order/entities';
import type { OrderRepository, PersistedOrderAggregate } from '../../data/order/repositories';
import { PaymentEntity } from '../../data/payment/entities';
import { ShipmentEntity, ShippingAddressEntity } from '../../data/shipping/entities';
import { CustomerOwnerResolver } from '../../domain/commerce-dependencies/customer-owner.resolver';
import { REQUIRED_ROLES } from '../authentication/authentication.decorators';
import { AccessTokenGuard, RolesGuard } from '../authentication/authentication.guards';
import { CustomerOrderController } from './customer-order.controller';
import { CustomerOrderService } from './customer-order.service';

describe('CustomerOrderService', () => {
  it('returns an empty paginated list from the authenticated Customer scope', async () => {
    const { service, repository } = setup();
    repository.findCustomerPage.mockResolvedValue({ items: [], totalItems: 0 });

    await expect(service.list(customerActor(), query())).resolves.toEqual({
      items: [],
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
    expect(repository.findCustomerPage).toHaveBeenCalledWith('customer-1', {
      page: 1,
      pageSize: 20,
      orderStatus: undefined,
      paymentStatus: undefined,
      shippingStatus: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    });
  });

  it('maps canonical COD/VNPAY state and executable filters without using a client customerId', async () => {
    const { service, repository } = setup();
    const cod = aggregate({ orderId: '10', method: 'cod', paymentStatus: 'pending' });
    const vnpay = aggregate({
      orderId: '11',
      method: 'vnpay',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      providerReference: 'HHVNP11SAFE',
    });
    repository.findCustomerPage.mockResolvedValue({
      items: [
        { order: vnpay.order, payment: vnpay.payment, shipment: vnpay.shipment, itemCount: 1 },
        { order: cod.order, payment: cod.payment, shipment: cod.shipment, itemCount: 2 },
      ],
      totalItems: 2,
    });

    const result = await service.list(customerActor(), {
      ...query(),
      pageSize: 1,
      orderStatus: 'confirmed',
      paymentStatus: 'paid',
      shippingStatus: 'pending',
      dateFrom: '2026-08-01T00:00:00.000Z',
      dateTo: '2026-08-31T23:59:59.999Z',
    });

    expect(result.items).toEqual([
      expect.objectContaining({
        orderId: '11',
        paymentMethod: 'vnpay',
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
      }),
      expect.objectContaining({
        orderId: '10',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'new',
      }),
    ]);
    expect(result.pagination).toMatchObject({ totalItems: 2, totalPages: 2, hasNextPage: true });
    expect(repository.findCustomerPage).toHaveBeenCalledWith(
      'customer-1',
      expect.objectContaining({
        orderStatus: 'confirmed',
        paymentStatus: 'paid',
        shippingStatus: 'pending',
        dateFrom: new Date('2026-08-01T00:00:00.000Z'),
        dateTo: new Date('2026-08-31T23:59:59.999Z'),
      }),
    );
  });

  it('returns persisted snapshots and only a safe Payment summary in detail', async () => {
    const { service, repository } = setup();
    const persisted = aggregate({
      orderId: '11',
      method: 'vnpay',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      providerReference: 'HHVNP11SAFE',
    });
    repository.findCustomerById.mockResolvedValue(persisted);

    const detail = await service.detail(customerActor(), '11');

    expect(repository.findCustomerById).toHaveBeenCalledWith('customer-1', '11');
    expect(detail).toMatchObject({
      orderId: '11',
      orderNumber: 'HH-20260813-11',
      orderStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'vnpay',
      subtotal: '125000.00',
      shippingFee: '0.00',
      total: '125000.00',
      items: [{ productName: 'Sản phẩm snapshot', unitPrice: '125000.00', quantity: 1 }],
      shippingAddress: {
        recipientName: 'Nguyễn Văn A',
        phone: '0901234567',
        countryCode: 'VN',
        addressLine: '12 Nguyễn Huệ',
      },
      payment: {
        method: 'vnpay',
        status: 'paid',
        amount: '125000.00',
        providerReference: 'HHVNP11SAFE',
      },
    });
    expect(JSON.stringify(detail)).not.toMatch(/secret|signature|hash/i);
  });

  it('returns the same not-found response for invalid and not-owned orders', async () => {
    const { service, repository } = setup();
    repository.findCustomerById.mockResolvedValue(null);

    await expect(service.detail(customerActor(), '999')).rejects.toMatchObject({
      status: 404,
      response: { code: 'ORDER.NOT_FOUND' },
    });
    await expect(service.detail(customerActor(), 'not-an-id')).rejects.toMatchObject({
      status: 404,
      response: { code: 'ORDER.NOT_FOUND' },
    });
  });

  it('rejects internal actors before querying Customer orders', async () => {
    const { service, repository } = setup();

    await expect(service.list(internalActor(), query())).rejects.toMatchObject({
      status: 403,
      response: { code: 'ORDER.ACCESS_DENIED' },
    });
    expect(repository.findCustomerPage).not.toHaveBeenCalled();
  });

  it('rejects reversed date ranges', async () => {
    const { service } = setup();
    await expect(
      service.list(customerActor(), {
        ...query(),
        dateFrom: '2026-08-31T00:00:00.000Z',
        dateTo: '2026-08-01T00:00:00.000Z',
      }),
    ).rejects.toMatchObject({ status: 400, response: { code: 'ORDER.DATE_RANGE_INVALID' } });
  });
});

describe('CustomerOrderController security metadata', () => {
  it('requires a bearer access token and CUSTOMER role for guest/internal isolation', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, CustomerOrderController) as unknown[];
    expect(guards).toEqual([AccessTokenGuard, RolesGuard]);
    expect(Reflect.getMetadata(REQUIRED_ROLES, CustomerOrderController)).toEqual(['CUSTOMER']);
  });

  it('rejects a guest request without a bearer access token', async () => {
    const guard = new AccessTokenGuard({ verifyAccessToken: vi.fn() } as never, {} as never);
    await expect(guard.canActivate(executionContext({ headers: {} }))).rejects.toMatchObject({
      status: 401,
    });
  });

  it('rejects an authenticated internal role at the Customer controller boundary', () => {
    const guard = new RolesGuard(new Reflector());
    expect(() =>
      guard.canActivate(
        executionContext({
          headers: {},
          auth: { ...internalActor(), roles: ['STAFF'] },
        }),
      ),
    ).toThrowError(expect.objectContaining({ status: 403 }));
  });
});

function setup() {
  const repository = {
    findByIdempotency: vi.fn(),
    findCustomerPage: vi.fn(),
    findCustomerById: vi.fn(),
    createSnapshot: vi.fn(),
  } satisfies Record<keyof OrderRepository, ReturnType<typeof vi.fn>>;
  const owners = new CustomerOwnerResolver({
    findActiveByUserAccountId: async (userAccountId) =>
      userAccountId === 'user-1' ? ({ id: 'customer-1' } as never) : null,
  });
  return {
    repository,
    service: new CustomerOrderService(repository as unknown as OrderRepository, owners),
  };
}

function query() {
  return { page: 1, pageSize: 20 };
}

function customerActor(): AuthenticatedRequestContext {
  return {
    userAccountId: 'user-1',
    sessionId: 'session-1',
    sessionPublicId: 'public-session-1',
    roles: ['CUSTOMER'],
    permissionsVersion: 1,
  };
}

function internalActor(): AuthenticatedRequestContext {
  return {
    userAccountId: 'staff-1',
    sessionId: 'session-2',
    sessionPublicId: 'public-session-2',
    roles: ['STAFF'],
    permissionsVersion: 1,
  };
}

function executionContext(request: Record<string, unknown>) {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => CustomerOrderController.prototype.list,
    getClass: () => CustomerOrderController,
  } as never;
}

function aggregate({
  orderId,
  method,
  paymentStatus,
  orderStatus = 'new',
  providerReference = null,
}: {
  orderId: string;
  method: 'cod' | 'vnpay';
  paymentStatus: 'pending' | 'paid';
  orderStatus?: 'new' | 'confirmed';
  providerReference?: string | null;
}): PersistedOrderAggregate {
  const createdAt = new Date('2026-08-13T08:00:00.000Z');
  const order = Object.assign(new OrderEntity(), {
    id: orderId,
    tenantId: '1',
    customerProfileId: 'customer-1',
    orderCode: `HH-20260813-${orderId}`,
    orderStatus,
    orderTotal: '125000.00',
    placedAt: createdAt,
    completedAt: null,
    createdAt,
    updatedAt: createdAt,
  });
  const item = Object.assign(new OrderItemEntity(), {
    id: `item-${orderId}`,
    tenantId: '1',
    orderId,
    productId: 'product-1',
    productNameSnapshot: 'Sản phẩm snapshot',
    skuSnapshot: 'SKU-SNAPSHOT',
    unitPriceSnapshot: '125000.00',
    quantity: 1,
    lineTotal: '125000.00',
    itemStatus: 'active',
  });
  const payment = Object.assign(new PaymentEntity(), {
    id: `payment-${orderId}`,
    tenantId: '1',
    orderId,
    paymentMethod: method,
    paymentAmount: '125000.00',
    paymentStatus,
    paidAt: paymentStatus === 'paid' ? createdAt : null,
    providerReference,
    updatedAt: createdAt,
  });
  const shipment = Object.assign(new ShipmentEntity(), {
    id: `shipment-${orderId}`,
    tenantId: '1',
    orderId,
    shippingMethod: 'manual',
    shippingFee: '0.00',
    shippingStatus: 'pending',
    trackingReference: null,
    shippedAt: null,
    deliveredAt: null,
  });
  const shippingAddress = Object.assign(new ShippingAddressEntity(), {
    id: `address-${orderId}`,
    tenantId: '1',
    shipmentId: shipment.id,
    recipientName: 'Nguyễn Văn A',
    recipientPhone: '0901234567',
    addressText: JSON.stringify({
      countryCode: 'VN',
      provinceCity: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Bến Nghé',
      addressLine: '12 Nguyễn Huệ',
    }),
    deliveryNote: null,
    addressSnapshotStatus: 'active',
  });
  return { order, items: [item], payment, shipment, shippingAddress };
}
