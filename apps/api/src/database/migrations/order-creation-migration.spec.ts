import { describe, expect, it, vi } from 'vitest';

import { CreateOrderCreationFoundation1760000004000 } from './1760000004000-create-order-creation-foundation';

describe('Order creation migration', () => {
  it('creates the transactional snapshot tables in dependency order', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new CreateOrderCreationFoundation1760000004000().up({ query } as never);
    expect(query.mock.calls.map(([sql]) => sql.match(/CREATE TABLE `([^`]+)`/)?.[1])).toEqual([
      'orders', 'order_items', 'payments', 'shipments', 'shipping_addresses',
    ]);
    expect(query.mock.calls[0][0]).toContain('uq_orders_tenant_customer_idempotency');
    expect(query.mock.calls[1][0]).toContain('product_name_snapshot');
    expect(query.mock.calls[4][0]).toContain('fk_shipping_addresses_shipment');
  });

  it('rolls back in reverse dependency order', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new CreateOrderCreationFoundation1760000004000().down({ query } as never);
    expect(query.mock.calls.map(([sql]) => sql)).toEqual([
      'DROP TABLE IF EXISTS `shipping_addresses`', 'DROP TABLE IF EXISTS `shipments`',
      'DROP TABLE IF EXISTS `payments`', 'DROP TABLE IF EXISTS `order_items`', 'DROP TABLE IF EXISTS `orders`',
    ]);
  });
});
