import { describe, expect, it, vi } from 'vitest';

import { EnableWishlistPersistenceV11760000009000 } from './1760000009000-enable-wishlist-persistence-v1';

describe('Wishlist persistence V1 migration', () => {
  it('creates owner-bound private Wishlists and duplicate-safe Wishlist items', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableWishlistPersistenceV11760000009000().up({ query } as never);
    expect(query.mock.calls[0][0]).toContain('CREATE TABLE `wishlists`');
    expect(query.mock.calls[0][0]).toContain('fk_wishlists_customer_profile');
    expect(query.mock.calls[0][0]).toContain('uq_wishlists_tenant_customer_name');
    expect(query.mock.calls[1][0]).toContain('CREATE TABLE `wishlist_items`');
    expect(query.mock.calls[1][0]).toContain('fk_wishlist_items_product');
    expect(query.mock.calls[1][0]).toContain('uq_wishlist_items_tenant_wishlist_product_status');
  });

  it('rolls back in reverse dependency order', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableWishlistPersistenceV11760000009000().down({ query } as never);
    expect(query.mock.calls.map(([sql]) => sql)).toEqual([
      'DROP TABLE IF EXISTS `wishlist_items`',
      'DROP TABLE IF EXISTS `wishlists`',
    ]);
  });
});
