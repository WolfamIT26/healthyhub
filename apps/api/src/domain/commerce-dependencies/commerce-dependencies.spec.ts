import { describe, expect, it, vi } from 'vitest';

import { CustomerOwnerResolutionError, CustomerOwnerResolver } from './customer-owner.resolver';
import { InventoryAvailabilityReader } from './inventory-availability.reader';
import { ProductCommerceReader } from './product-commerce.reader';

const activeProduct = {
  id: '101',
  productName: 'Sữa yến mạch',
  slug: 'sua-yen-mach',
  basePrice: '69000.00',
  productStatus: 'active',
  productVisibility: 'public',
  sellableStatus: 'sellable',
  deletedAt: null,
};

describe('Cart minimum executable dependencies', () => {
  it('reads authoritative Product identity, price and sellable state from repository', async () => {
    const repository = { findById: vi.fn().mockResolvedValue(activeProduct) };
    const reader = new ProductCommerceReader(repository as never);
    await expect(reader.getProductCommerceSnapshot('101')).resolves.toEqual({
      productId: '101',
      name: 'Sữa yến mạch',
      slug: 'sua-yen-mach',
      currentPrice: '69000.00',
      currency: 'VND',
      publiclyVisible: true,
      sellableStatus: 'sellable',
      sellable: true,
    });
    expect(repository.findById).toHaveBeenCalledWith('101');
  });

  it('returns missing and non-sellable Product without any fallback authority', async () => {
    const repository = {
      findById: vi
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ...activeProduct, productVisibility: 'hidden' }),
    };
    const reader = new ProductCommerceReader(repository as never);
    await expect(reader.getProductCommerceSnapshot('missing')).resolves.toBeNull();
    await expect(reader.findSellableProduct('101')).resolves.toBeNull();
  });

  it.each([
    [{ availableQuantity: 8, stockStatus: 'available', deletedAt: null }, 2, 'AVAILABLE'],
    [{ availableQuantity: 3, stockStatus: 'low_stock', deletedAt: null }, 2, 'LOW_STOCK'],
    [{ availableQuantity: 2, stockStatus: 'available', deletedAt: null }, 3, 'INSUFFICIENT_STOCK'],
    [{ availableQuantity: 0, stockStatus: 'out_of_stock', deletedAt: null }, 1, 'OUT_OF_STOCK'],
    [{ availableQuantity: 0, stockStatus: 'available', deletedAt: null }, 1, 'OUT_OF_STOCK'],
    [{ availableQuantity: 5, stockStatus: 'disabled', deletedAt: null }, 1, 'UNAVAILABLE'],
    [{ availableQuantity: 5, stockStatus: 'available', deletedAt: new Date() }, 1, 'UNAVAILABLE'],
  ])(
    'evaluates Inventory availability without mutation or fake fallback',
    async (item, quantity, status) => {
      const reader = new InventoryAvailabilityReader({
        findByProductId: vi.fn().mockResolvedValue(item),
      } as never);
      await expect(reader.checkAvailability('101', quantity)).resolves.toMatchObject({ status });
    },
  );

  it('rejects invalid quantity and treats a missing Inventory row as unavailable', async () => {
    const reader = new InventoryAvailabilityReader({
      findByProductId: vi.fn().mockResolvedValue(null),
    } as never);
    await expect(reader.checkAvailability('101', 0)).resolves.toEqual({
      status: 'INVALID_QUANTITY',
      availableQuantity: null,
    });
    await expect(reader.checkAvailability('101', 1)).resolves.toEqual({
      status: 'UNAVAILABLE',
      availableQuantity: null,
    });
  });

  it('resolves verified or unverified authenticated Customers only from actor identity', async () => {
    const repository = { findActiveByUserAccountId: vi.fn().mockResolvedValue({ id: '501' }) };
    const resolver = new CustomerOwnerResolver(repository as never);
    await expect(
      resolver.resolve({ userAccountId: '42', roles: ['CUSTOMER'] } as never),
    ).resolves.toEqual({ customerProfileId: '501', userAccountId: '42' });
    expect(repository.findActiveByUserAccountId).toHaveBeenCalledWith('42');
  });

  it('rejects internal actors and missing CustomerProfile mappings', async () => {
    const repository = { findActiveByUserAccountId: vi.fn().mockResolvedValue(null) };
    const resolver = new CustomerOwnerResolver(repository as never);
    await expect(
      resolver.resolve({ userAccountId: '7', roles: ['ADMINISTRATOR'] } as never),
    ).rejects.toMatchObject({ code: 'CUSTOMER_ROLE_REQUIRED' });
    await expect(
      resolver.resolve({ userAccountId: '42', roles: ['CUSTOMER'] } as never),
    ).rejects.toBeInstanceOf(CustomerOwnerResolutionError);
  });
});
