import { describe, expect, it, vi } from 'vitest';

import { EnableInventoryStockLifecycleV11760000013000 } from './1760000013000-enable-inventory-stock-lifecycle-v1';

describe('Inventory stock lifecycle V1 migration', () => {
  it('creates the Order-scoped reservation and idempotency authority', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableInventoryStockLifecycleV11760000013000().up({ query } as never);
    const sql = query.mock.calls[0][0] as string;
    expect(sql).toContain('CREATE TABLE stock_reservations');
    expect(sql).toContain('uq_stock_reservations_tenant_order_item');
    expect(sql).toContain('fk_stock_reservations_inventory_item');
    expect(sql).toContain('fk_stock_reservations_order');
    expect(sql).not.toContain('expires_at');
  });

  it('drops only the lifecycle table on rollback', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableInventoryStockLifecycleV11760000013000().down({ query } as never);
    expect(query).toHaveBeenCalledWith('DROP TABLE IF EXISTS stock_reservations');
  });
});
