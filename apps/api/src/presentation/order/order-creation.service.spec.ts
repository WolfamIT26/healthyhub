import { describe, expect, it, vi } from 'vitest';

import { InventoryStockMutationError } from '../../data/inventory/repositories';
import { CustomerOwnerResolutionError } from '../../domain/commerce-dependencies/customer-owner.resolver';
import { PaymentMethodReader } from '../../domain/payment/payment-method.reader';
import { ShippingQuoteService } from '../../domain/shipping/shipping-quote.service';
import { EmailVerificationPolicyService } from '../authentication/email-verification-policy.service';
import { OrderCreationService } from './order-creation.service';

const auth = { userAccountId: '42', roles: ['CUSTOMER'] } as never;
const address = {
  recipientName: 'Nguyễn Văn A',
  phone: '0901234567',
  countryCode: 'VN',
  provinceCity: 'Hồ Chí Minh',
  district: 'Quận 1',
  ward: 'Bến Nghé',
  addressLine: '12 Nguyễn Huệ',
  note: 'Gọi trước',
};
const cart = { id: '10', customerProfileId: '7', cartStatus: 'active' };
const persistedItem = { id: 'cart-item-1', productId: '1', quantity: 2 };
const product = {
  productId: '1',
  productCode: 'HH-0001',
  name: 'Sữa yến mạch',
  slug: 'sua-yen-mach',
  currentPrice: '69000.00',
  currency: 'VND',
  sellable: true,
};

function setup() {
  const shipping = new ShippingQuoteService();
  const repository = {
    findByIdempotency: vi.fn().mockResolvedValue(null),
    createSnapshot: vi.fn(),
  };
  const carts = {
    findActive: vi.fn().mockResolvedValue(cart),
    listActiveItems: vi.fn().mockResolvedValue([persistedItem]),
  };
  const authentication = {
    findAccountById: vi
      .fn()
      .mockResolvedValue({ emailVerifiedAt: new Date(), userStatus: 'active' }),
  };
  const owners = {
    resolve: vi.fn().mockResolvedValue({ customerProfileId: '7', userAccountId: '42' }),
  };
  const products = { findSellableProduct: vi.fn().mockResolvedValue(product) };
  const inventory = {
    checkAvailability: vi.fn().mockResolvedValue({ status: 'AVAILABLE', availableQuantity: 5 }),
  };
  repository.createSnapshot.mockImplementation(async (input) =>
    aggregate({
      requestHash: input.requestHash,
      paymentMethod: input.payment.method,
    }),
  );
  const service = new OrderCreationService(
    repository as never,
    carts as never,
    authentication as never,
    owners as never,
    products as never,
    inventory as never,
    shipping,
    new PaymentMethodReader(),
    new EmailVerificationPolicyService(),
  );
  const quote = shipping.quote(address, 'manual', {
    cartId: '10',
    subtotal: '138000.00',
    itemCount: 2,
    isValid: true,
  });
  const input = {
    shippingAddress: address,
    shippingMethod: 'manual' as const,
    shippingQuoteReference: quote.quoteReference,
    paymentMethod: 'cod' as const,
  };
  return { service, repository, carts, authentication, owners, products, inventory, input };
}

describe('OrderCreationService', () => {
  it('creates a verified Customer Order from authoritative Cart/Product/Shipping/COD snapshots', async () => {
    const { service, repository, input } = setup();
    await expect(
      service.createOrderFromCheckout(auth, 'checkout-attempt-001', input),
    ).resolves.toMatchObject({
      status: 'new',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      shippingMethod: 'manual',
      subtotal: '138000.00',
      shippingFee: '0.00',
      total: '138000.00',
      currency: 'VND',
      items: [
        {
          productId: '1',
          productName: 'Sữa yến mạch',
          sku: 'HH-0001',
          unitPrice: '69000.00',
          quantity: 2,
          lineTotal: '138000.00',
        },
      ],
    });
    expect(repository.createSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        customerProfileId: '7',
        cartId: '10',
        orderTotal: '138000.00',
        payment: { method: 'cod', amount: '138000.00', status: 'pending' },
        shipping: expect.objectContaining({ method: 'manual', fee: '0.00' }),
      }),
    );
  });

  it('accepts VNPAY as a supported payment method for persisted Order snapshots', async () => {
    const { service, repository, input } = setup();
    await expect(
      service.createOrderFromCheckout(auth, 'checkout-attempt-vnpay', {
        ...input,
        paymentMethod: 'vnpay' as const,
      }),
    ).resolves.toMatchObject({
      status: 'new',
      paymentStatus: 'pending',
      paymentMethod: 'vnpay',
    });
    expect(repository.createSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        payment: { method: 'vnpay', amount: '138000.00', status: 'pending' },
      }),
    );
  });

  it('rejects unverified Customer before creating an Order', async () => {
    const { service, authentication, repository, input } = setup();
    authentication.findAccountById.mockResolvedValue({
      emailVerifiedAt: null,
      userStatus: 'pending',
    });
    await expect(
      service.createOrderFromCheckout(auth, 'checkout-attempt-001', input),
    ).rejects.toMatchObject({ response: { code: 'AUTH.EMAIL_NOT_VERIFIED' } });
    expect(repository.createSnapshot).not.toHaveBeenCalled();
  });

  it('rejects an internal actor and never accepts owner identity from input', async () => {
    const { service, owners, repository, input } = setup();
    owners.resolve.mockRejectedValue(new CustomerOwnerResolutionError('CUSTOMER_ROLE_REQUIRED'));
    await expect(
      service.createOrderFromCheckout(auth, 'checkout-attempt-001', {
        ...input,
        customerId: '999',
      } as never),
    ).rejects.toMatchObject({ response: { code: 'ORDER.ACCESS_DENIED' } });
    expect(repository.createSnapshot).not.toHaveBeenCalled();
  });

  it.each([
    [
      'missing Cart',
      (state: ReturnType<typeof setup>) => state.carts.findActive.mockResolvedValue(null),
      'ORDER.CART_EMPTY',
    ],
    [
      'empty Cart',
      (state: ReturnType<typeof setup>) => state.carts.listActiveItems.mockResolvedValue([]),
      'ORDER.CART_EMPTY',
    ],
    [
      'unavailable Product',
      (state: ReturnType<typeof setup>) =>
        state.products.findSellableProduct.mockResolvedValue(null),
      'ORDER.CART_INVALID',
    ],
    [
      'insufficient stock',
      (state: ReturnType<typeof setup>) =>
        state.inventory.checkAvailability.mockResolvedValue({
          status: 'INSUFFICIENT_STOCK',
          availableQuantity: 1,
        }),
      'ORDER.INSUFFICIENT_STOCK',
    ],
  ])('rejects %s', async (_label, mutate, code) => {
    const state = setup();
    mutate(state);
    await expect(
      state.service.createOrderFromCheckout(auth, 'checkout-attempt-001', state.input),
    ).rejects.toMatchObject({ response: { code } });
  });

  it('rejects stale Shipping quote and unsupported Shipping/Payment methods', async () => {
    const stale = setup();
    await expect(
      stale.service.createOrderFromCheckout(auth, 'checkout-attempt-001', {
        ...stale.input,
        shippingQuoteReference: 'shq_stale',
      }),
    ).rejects.toMatchObject({ response: { code: 'ORDER.SHIPPING_INVALID' } });
    const shippingMethod = setup();
    await expect(
      shippingMethod.service.createOrderFromCheckout(auth, 'checkout-attempt-002', {
        ...shippingMethod.input,
        shippingMethod: 'express',
      } as never),
    ).rejects.toMatchObject({ response: { code: 'ORDER.SHIPPING_INVALID' } });
    const paymentMethod = setup();
    await expect(
      paymentMethod.service.createOrderFromCheckout(auth, 'checkout-attempt-003', {
        ...paymentMethod.input,
        paymentMethod: 'online',
      } as never),
    ).rejects.toMatchObject({ response: { code: 'ORDER.PAYMENT_METHOD_UNSUPPORTED' } });
  });

  it('returns the same Order for the same idempotency key and identical request', async () => {
    const state = setup();
    await state.service.createOrderFromCheckout(auth, 'checkout-attempt-001', state.input);
    const createdInput = state.repository.createSnapshot.mock.calls[0][0];
    state.repository.findByIdempotency.mockResolvedValue(
      aggregate({ requestHash: createdInput.requestHash }),
    );
    await expect(
      state.service.createOrderFromCheckout(auth, 'checkout-attempt-001', state.input),
    ).resolves.toMatchObject({ orderId: '100', orderNumber: 'HH-20260809-ABCDEF123456' });
    expect(state.repository.createSnapshot).toHaveBeenCalledTimes(1);
  });

  it('rejects conflicting payload reuse of an idempotency key', async () => {
    const state = setup();
    state.repository.findByIdempotency.mockResolvedValue(
      aggregate({ requestHash: 'different-request' }),
    );
    await expect(
      state.service.createOrderFromCheckout(auth, 'checkout-attempt-001', state.input),
    ).rejects.toMatchObject({ response: { code: 'ORDER.IDEMPOTENCY_CONFLICT' } });
  });

  it('does not expose a partial Order when transactional persistence fails', async () => {
    const state = setup();
    state.repository.createSnapshot.mockRejectedValue(new Error('transaction rolled back'));
    await expect(
      state.service.createOrderFromCheckout(auth, 'checkout-attempt-001', state.input),
    ).rejects.toThrow('transaction rolled back');
  });

  it('maps a locked stock race to the canonical insufficient-stock response', async () => {
    const state = setup();
    state.repository.createSnapshot.mockRejectedValue(
      new InventoryStockMutationError('INSUFFICIENT_STOCK', 'concurrent order won'),
    );
    await expect(
      state.service.createOrderFromCheckout(auth, 'checkout-stock-race', state.input),
    ).rejects.toMatchObject({ response: { code: 'ORDER.INSUFFICIENT_STOCK' } });
  });

  it('keeps persisted Order snapshots unchanged when Product authority later changes', async () => {
    const state = setup();
    const created = await state.service.createOrderFromCheckout(
      auth,
      'checkout-attempt-001',
      state.input,
    );
    state.products.findSellableProduct.mockResolvedValue({ ...product, currentPrice: '99000.00' });
    expect(created.items[0]).toMatchObject({ unitPrice: '69000.00', lineTotal: '138000.00' });
  });
});

function aggregate({
  requestHash,
  paymentMethod = 'cod',
}: {
  requestHash: string;
  paymentMethod?: 'cod' | 'vnpay';
}) {
  return {
    order: {
      id: '100',
      orderCode: 'HH-20260809-ABCDEF123456',
      orderStatus: 'new',
      orderTotal: '138000.00',
      requestHash,
      placedAt: new Date('2026-08-09T00:00:00Z'),
    },
    items: [
      {
        productId: '1',
        productNameSnapshot: 'Sữa yến mạch',
        skuSnapshot: 'HH-0001',
        unitPriceSnapshot: '69000.00',
        quantity: 2,
        lineTotal: '138000.00',
      },
    ],
    payment: { paymentStatus: 'pending', paymentMethod },
    shipment: { shippingStatus: 'pending', shippingMethod: 'manual', shippingFee: '0.00' },
    shippingAddress: {
      addressText: JSON.stringify({
        countryCode: 'VN',
        provinceCity: 'Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Bến Nghé',
        addressLine: '12 Nguyễn Huệ',
      }),
    },
  };
}
