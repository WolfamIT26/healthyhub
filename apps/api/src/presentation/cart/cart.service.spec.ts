import { describe, expect, it, vi } from 'vitest';

import { CartService } from './cart.service';

const auth = { userAccountId: '42', roles: ['CUSTOMER'] } as never;
const cart = {
  id: '10',
  customerProfileId: '7',
  cartStatus: 'active',
  cartValidationStatus: 'not_validated',
  updatedAt: new Date('2026-08-09T00:00:00Z'),
};
const product = {
  productId: '1',
  name: 'Sữa yến mạch',
  slug: 'sua-yen-mach',
  currentPrice: '69000.00',
  currency: 'VND',
  sellable: true,
};

function setup() {
  const repository = {
    findOrCreateActive: vi.fn().mockResolvedValue(cart),
    findActive: vi.fn().mockResolvedValue(cart),
    listActiveItems: vi.fn().mockResolvedValue([]),
    addOrMerge: vi.fn().mockResolvedValue(true),
    updateQuantity: vi.fn().mockResolvedValue(true),
    remove: vi.fn().mockResolvedValue(true),
    findOwnedActiveItem: vi.fn().mockResolvedValue({ id: 'item-1', productId: '1', quantity: 1 }),
  };
  const products = {
    findSellableProduct: vi.fn().mockResolvedValue(product),
    getProductCommerceSnapshot: vi.fn().mockResolvedValue(product),
  };
  const inventory = {
    checkAvailability: vi.fn().mockResolvedValue({ status: 'AVAILABLE', availableQuantity: 8 }),
  };
  const owners = {
    resolve: vi.fn().mockResolvedValue({ customerProfileId: '7', userAccountId: '42' }),
  };
  return {
    service: new CartService(
      repository as never,
      products as never,
      inventory as never,
      owners as never,
    ),
    repository,
    products,
    inventory,
    owners,
  };
}

describe('CartService', () => {
  it('creates/loads an active Customer Cart and returns an authoritative empty read model', async () => {
    const { service, repository } = setup();
    await expect(service.get(auth)).resolves.toMatchObject({
      id: '10',
      itemCount: 0,
      subtotal: '0.00',
    });
    expect(repository.findOrCreateActive).toHaveBeenCalledWith('7', '42');
  });

  it('adds a sellable product with Inventory maximum and never accepts a client price', async () => {
    const { service, repository } = setup();
    await service.add(auth, '1', 2);
    expect(repository.addOrMerge).toHaveBeenCalledWith('7', '42', '1', 2, 8);
  });

  it('builds exact line totals and subtotal from Product authority', async () => {
    const { service, repository } = setup();
    repository.listActiveItems.mockResolvedValue([{ id: 'item-1', productId: '1', quantity: 3 }]);
    await expect(service.get(auth)).resolves.toMatchObject({
      itemCount: 3,
      subtotal: '207000.00',
      items: [{ unitPrice: '69000.00', lineTotal: '207000.00' }],
    });
  });

  it.each([
    ['INSUFFICIENT_STOCK', 'INSUFFICIENT_STOCK'],
    ['OUT_OF_STOCK', 'PRODUCT_NOT_AVAILABLE'],
    ['UNAVAILABLE', 'PRODUCT_NOT_AVAILABLE'],
    ['INVALID_QUANTITY', 'INVALID_QUANTITY'],
  ])('rejects Inventory state %s', async (status, code) => {
    const { service, inventory } = setup();
    inventory.checkAvailability.mockResolvedValue({ status, availableQuantity: 0 });
    await expect(service.add(auth, '1', 2)).rejects.toMatchObject({ response: { code } });
  });

  it('rejects a missing or non-sellable Product', async () => {
    const { service, products } = setup();
    products.findSellableProduct.mockResolvedValue(null);
    await expect(service.add(auth, '999', 1)).rejects.toMatchObject({
      response: { code: 'PRODUCT_NOT_AVAILABLE' },
    });
  });

  it('updates and removes only an item resolved through the owner-scoped repository', async () => {
    const { service, repository } = setup();
    await service.update(auth, 'item-1', 2);
    await service.remove(auth, 'item-1');
    expect(repository.updateQuantity).toHaveBeenCalledWith('7', '42', 'item-1', 2);
    expect(repository.remove).toHaveBeenCalledWith('7', '42', 'item-1');
  });

  it('does not leak a missing or cross-owner Cart item', async () => {
    const { service, repository } = setup();
    repository.findOwnedActiveItem.mockResolvedValue(null);
    await expect(service.update(auth, 'foreign-item', 2)).rejects.toMatchObject({
      response: { code: 'CART_ITEM_NOT_FOUND' },
    });
  });

  it('rejects internal actors through CustomerOwnerResolver', async () => {
    const { service, owners } = setup();
    const error = Object.assign(new Error('CUSTOMER_ROLE_REQUIRED'), {
      code: 'CUSTOMER_ROLE_REQUIRED',
    });
    error.name = 'CustomerOwnerResolutionError';
    owners.resolve.mockRejectedValue(error);
    await expect(service.get(auth)).rejects.toThrow();
  });

  it('returns conflict when a locked duplicate merge would exceed stock', async () => {
    const { service, repository } = setup();
    repository.addOrMerge.mockResolvedValue(false);
    await expect(service.add(auth, '1', 2)).rejects.toMatchObject({
      response: { code: 'INSUFFICIENT_STOCK' },
    });
  });
});
