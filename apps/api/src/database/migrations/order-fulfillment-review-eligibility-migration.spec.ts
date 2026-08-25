import { describe, expect, it, vi } from 'vitest';

import { EnableOrderFulfillmentReviewEligibility1760000014000 } from './1760000014000-enable-order-fulfillment-review-eligibility';

describe('Order fulfillment and Review eligibility migration', () => {
  it('expands only canonical statuses and creates durable transition histories', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableOrderFulfillmentReviewEligibility1760000014000().up({ query } as never);
    const sql = query.mock.calls.map(([statement]) => statement as string).join('\n');

    expect(sql).toContain("'new','confirmed','completed','cancelled','returned'");
    expect(sql).toContain("'pending','shipped','delivered','cancelled','returned'");
    expect(sql).toContain('CREATE TABLE order_status_histories');
    expect(sql).toContain('CREATE TABLE shipping_status_histories');
    expect(sql).toContain('fk_order_status_histories_order');
    expect(sql).toContain('fk_shipping_status_histories_shipment');
    expect(sql).not.toContain("'processing'");
    expect(sql).not.toContain("'preparing'");
  });

  it('provides a structural rollback to the previous executable status contract', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableOrderFulfillmentReviewEligibility1760000014000().down({ query } as never);
    const statements = query.mock.calls.map(([statement]) => statement as string);

    expect(statements).toContain('DROP TABLE IF EXISTS `shipping_status_histories`');
    expect(statements).toContain('DROP TABLE IF EXISTS `order_status_histories`');
    expect(statements.at(-3)).toContain('chk_orders_status_v2');
    expect(statements.at(-2)).toContain('chk_orders_shipping_status');
    expect(statements.at(-1)).toContain('chk_shipments_status');
  });
});
