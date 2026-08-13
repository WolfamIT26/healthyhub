import { describe, expect, it, vi } from 'vitest';

import { CustomerOwnerResolutionError } from '../../domain/commerce-dependencies/customer-owner.resolver';
import { WishlistService } from './wishlist.service';

const auth = {
  userAccountId: '42',
  sessionId: '1',
  sessionPublicId: 'session-wishlist',
  roles: ['CUSTOMER'],
  permissionsVersion: 1,
} as never;
const wishlist = { id: '10', customerProfileId: '7', wishlistStatus: 'active' };
const item = {
  id: '100',
  wishlistId: '10',
  productId: '1',
  savedAt: new Date('2026-08-13T00:00:00.000Z'),
};
const product = {
  productId: '1',
  productCode: 'HH-0001',
  name: 'Sữa yến mạch',
  slug: 'oat-milk-original',
  currentPrice: '69000.00',
  currency: 'VND',
  publiclyVisible: true,
  sellableStatus: 'sellable',
  sellable: true,
};

function setup() {
  const repository = {
    findActive: vi.fn().mockResolvedValue(wishlist),
    listActiveItems: vi.fn().mockResolvedValue([item]),
    countActiveItems: vi.fn().mockResolvedValue(1),
    add: vi.fn().mockResolvedValue(item),
    removeOwnedItem: vi.fn().mockResolvedValue({ productId: '1', found: true }),
    removeOwnedProduct: vi.fn().mockResolvedValue({ productId: '1', found: true }),
  };
  const products = { getProductCommerceSnapshot: vi.fn().mockResolvedValue(product) };
  const inventory = {
    checkAvailability: vi.fn().mockResolvedValue({ status: 'AVAILABLE', availableQuantity: 10 }),
  };
  const owners = {
    resolve: vi.fn().mockResolvedValue({ customerProfileId: '7', userAccountId: '42' }),
  };
  return {
    service: new WishlistService(
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

describe('WishlistService', () => {
  it('returns an owner-scoped empty Wishlist without creating persistence on read', async () => {
    const { service, repository } = setup();
    repository.findActive.mockResolvedValue(null);
    await expect(service.get(auth, { page: 1, pageSize: 20 })).resolves.toEqual({
      items: [],
      page: 1,
      pageSize: 20,
      totalItems: 0,
      totalPages: 0,
    });
    expect(repository.findActive).toHaveBeenCalledWith('7');
    expect(repository.add).not.toHaveBeenCalled();
  });

  it('loads current Product/Inventory state with stable pagination', async () => {
    const { service, repository, inventory } = setup();
    inventory.checkAvailability.mockResolvedValue({ status: 'OUT_OF_STOCK', availableQuantity: 0 });
    await expect(service.get(auth, { page: 2, pageSize: 10 })).resolves.toMatchObject({
      page: 2,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      items: [
        {
          wishlistItemId: '100',
          product: { productId: '1', availability: 'OUT_OF_STOCK' },
          addedAt: '2026-08-13T00:00:00.000Z',
        },
      ],
    });
    expect(repository.listActiveItems).toHaveBeenCalledWith('10', 10, 10);
  });

  it('adds only a public Product using the JWT-derived owner and tolerates duplicate calls', async () => {
    const { service, repository } = setup();
    await service.add(auth, '1');
    await service.add(auth, '1');
    expect(repository.add).toHaveBeenNthCalledWith(1, '7', '42', '1');
    expect(repository.add).toHaveBeenCalledTimes(2);
  });

  it('rejects a missing or non-public Product without creating a Wishlist item', async () => {
    const { service, products, repository } = setup();
    products.getProductCommerceSnapshot.mockResolvedValue({ ...product, publiclyVisible: false });
    await expect(service.add(auth, '999')).rejects.toMatchObject({
      response: { code: 'NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND' },
      status: 404,
    });
    expect(repository.add).not.toHaveBeenCalled();
  });

  it('removes an owned item and does not leak a foreign Wishlist item', async () => {
    const { service, repository } = setup();
    await expect(service.removeItem(auth, '100')).resolves.toEqual({
      productId: '1',
      deleted: true,
    });
    repository.removeOwnedItem.mockResolvedValue({ productId: '', found: false });
    await expect(service.removeItem(auth, '999')).rejects.toMatchObject({
      response: { code: 'NOT_FOUND.WISHLIST.ITEM_NOT_FOUND' },
      status: 404,
    });
  });

  it('keeps remove-by-product idempotent for rapid repeated actions', async () => {
    const { service, repository } = setup();
    repository.removeOwnedProduct.mockResolvedValue({ productId: '1', found: false });
    await expect(service.removeProduct(auth, '1')).resolves.toEqual({
      productId: '1',
      deleted: true,
    });
  });

  it('rejects Internal actors through the shared Customer owner authority', async () => {
    const { service, owners } = setup();
    owners.resolve.mockRejectedValue(new CustomerOwnerResolutionError('CUSTOMER_ROLE_REQUIRED'));
    await expect(service.get(auth, { page: 1, pageSize: 20 })).rejects.toMatchObject({
      response: { code: 'PERMISSION.WISHLIST.OWNER_REQUIRED' },
      status: 403,
    });
  });
});
