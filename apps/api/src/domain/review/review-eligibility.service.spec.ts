import { describe, expect, it, vi } from 'vitest';

import { ReviewEligibilityPolicy } from './review-eligibility.policy';
import { ReviewEligibilityService } from './review-eligibility.service';

const auth = { userAccountId: 'user-a', roles: ['CUSTOMER'] } as never;

describe('ReviewEligibilityService', () => {
  it('derives Customer ownership before resolving Order/Product evidence', async () => {
    const owners = {
      resolve: vi.fn().mockResolvedValue({ customerProfileId: 'customer-a' }),
    };
    const repository = {
      findEvidence: vi.fn().mockResolvedValue({
        orderId: '10',
        productId: '20',
        orderStatus: 'completed',
        shippingStatus: 'delivered',
        completedAt: new Date(),
        deliveredAt: new Date(),
        hasActiveProduct: true,
      }),
    };
    const service = new ReviewEligibilityService(
      owners as never,
      repository,
      new ReviewEligibilityPolicy(),
    );

    await expect(service.evaluate(auth, '10', '20')).resolves.toMatchObject({ eligible: true });
    expect(repository.findEvidence).toHaveBeenCalledWith('customer-a', '10', '20');
  });

  it('fails closed for foreign/missing Order and invalid identifiers', async () => {
    const repository = { findEvidence: vi.fn().mockResolvedValue(null) };
    const service = new ReviewEligibilityService(
      { resolve: vi.fn().mockResolvedValue({ customerProfileId: 'customer-a' }) } as never,
      repository,
      new ReviewEligibilityPolicy(),
    );

    await expect(service.evaluate(auth, '99', '20')).resolves.toEqual({
      eligible: false,
      reason: 'ORDER_NOT_FOUND_OR_NOT_OWNED',
    });
    await expect(service.evaluate(auth, '../10', '20')).resolves.toEqual({
      eligible: false,
      reason: 'ORDER_NOT_FOUND_OR_NOT_OWNED',
    });
    expect(repository.findEvidence).toHaveBeenCalledTimes(1);
  });
});
