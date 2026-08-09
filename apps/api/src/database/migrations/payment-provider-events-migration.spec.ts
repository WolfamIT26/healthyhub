import { describe, expect, it, vi } from 'vitest';
import { CreatePaymentProviderEvents1760000005000 } from './1760000005000-create-payment-provider-events';

describe('Payment provider events migration', () => {
  it('creates provider/event uniqueness without raw payload columns and rolls back', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    const migration = new CreatePaymentProviderEvents1760000005000();
    await migration.up({ query } as never);
    expect(query.mock.calls[0][0]).toContain('uq_payment_provider_events_identity');
    expect(query.mock.calls[0][0]).toContain('payload_hash');
    expect(query.mock.calls[0][0]).not.toContain('raw_payload');
    await migration.down({ query } as never);
    expect(query.mock.calls[1][0]).toBe('DROP TABLE IF EXISTS `payment_provider_events`');
  });
});
