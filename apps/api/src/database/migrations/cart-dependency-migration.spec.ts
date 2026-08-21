import { describe, expect, it, vi } from 'vitest';

import { CreateCartDependencyFoundation1760000002000 } from './1760000002000-create-cart-dependency-foundation';

describe('Cart dependency migration', () => {
  it('creates Product, CustomerProfile and Inventory tables in dependency order', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new CreateCartDependencyFoundation1760000002000().up({ query } as never);
    expect(query.mock.calls.map(([sql]) => sql)).toEqual([
      expect.stringContaining('CREATE TABLE `products`'),
      expect.stringContaining('CREATE TABLE `customer_profiles`'),
      expect.stringContaining('CREATE TABLE `inventory_items`'),
    ]);
    expect(query.mock.calls[1][0]).toContain('fk_customer_profiles_user_account');
    expect(query.mock.calls[2][0]).toContain('fk_inventory_items_product');
    expect(query.mock.calls[2][0]).toContain('uq_inventory_items_tenant_product');
    expect(query.mock.calls[2][0]).toContain('INT UNSIGNED NOT NULL DEFAULT 0');
    expect(query.mock.calls[2][0]).toContain('chk_inventory_quantities');
  });

  it('rolls back in reverse dependency order', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new CreateCartDependencyFoundation1760000002000().down({ query } as never);
    expect(query.mock.calls.map(([sql]) => sql)).toEqual([
      'DROP TABLE IF EXISTS `inventory_items`',
      'DROP TABLE IF EXISTS `customer_profiles`',
      'DROP TABLE IF EXISTS `products`',
    ]);
  });
});
