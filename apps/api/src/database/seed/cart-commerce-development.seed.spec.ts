import { describe, expect, it, vi } from 'vitest';

import type { EntityManager } from 'typeorm';
import { seedCartCommerceDevelopment } from './cart-commerce-development.seed';

describe('Cart commerce development seed', () => {
  it('idempotently seeds aligned BIGINT Product and Inventory authority without accounts', async () => {
    const productRepository = { upsert: vi.fn().mockResolvedValue(undefined) };
    const inventoryRepository = { upsert: vi.fn().mockResolvedValue(undefined) };
    const manager = { getRepository: vi.fn().mockReturnValueOnce(productRepository).mockReturnValueOnce(inventoryRepository) } as unknown as EntityManager;
    await seedCartCommerceDevelopment(manager);
    expect(productRepository.upsert).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ id: '1', slug: 'oat-milk-original', basePrice: '69000.00' }),
      expect.objectContaining({ id: '5', sellableStatus: 'out_of_stock' }),
    ]), ['id']);
    expect(inventoryRepository.upsert).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ productId: '1', availableQuantity: 25 }),
      expect.objectContaining({ productId: '5', availableQuantity: 0, stockStatus: 'out_of_stock' }),
    ]), ['tenantId', 'productId']);
  });
});
