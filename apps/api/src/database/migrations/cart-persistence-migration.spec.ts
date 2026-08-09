import { describe, expect, it, vi } from 'vitest';

import { CreateCartPersistence1760000003000 } from './1760000003000-create-cart-persistence';

describe('Cart persistence migration', () => {
  it('creates Cart before CartItem with ownership, duplicate and quantity constraints', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new CreateCartPersistence1760000003000().up({ query } as never);
    expect(query.mock.calls[0][0]).toContain('CREATE TABLE `carts`');
    expect(query.mock.calls[0][0]).toContain('fk_carts_customer_profile');
    expect(query.mock.calls[1][0]).toContain('CREATE TABLE `cart_items`');
    expect(query.mock.calls[1][0]).toContain('uq_cart_items_tenant_cart_product_status');
    expect(query.mock.calls[1][0]).toContain('chk_cart_items_quantity');
  });

  it('rolls back in reverse dependency order', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new CreateCartPersistence1760000003000().down({ query } as never);
    expect(query.mock.calls.map(([sql]) => sql)).toEqual([
      'DROP TABLE IF EXISTS `cart_items`',
      'DROP TABLE IF EXISTS `carts`',
    ]);
  });
});
