import { describe, expect, it, vi } from 'vitest';

import { EnableCustomerProfileAddressV11760000008000 } from './1760000008000-enable-customer-profile-address-v1';

describe('Customer Profile and Address V1 migration', () => {
  it('creates owner-bound Vietnam addresses with one active default and idempotency', async () => {
    const query = vi.fn().mockResolvedValue(undefined);

    await new EnableCustomerProfileAddressV11760000008000().up({ query } as never);

    expect(query).toHaveBeenCalledTimes(1);
    const sql = query.mock.calls[0][0] as string;
    expect(sql).toContain('CREATE TABLE `customer_addresses`');
    expect(sql).toContain('fk_customer_addresses_profile');
    expect(sql).toContain('uq_customer_addresses_active_default');
    expect(sql).toContain('uq_customer_addresses_idempotency');
    expect(sql).toContain("CHECK (`country_code` = 'VN')");
  });

  it('rolls back only the Address Book table', async () => {
    const query = vi.fn().mockResolvedValue(undefined);

    await new EnableCustomerProfileAddressV11760000008000().down({ query } as never);

    expect(query).toHaveBeenCalledWith('DROP TABLE IF EXISTS `customer_addresses`');
  });
});
