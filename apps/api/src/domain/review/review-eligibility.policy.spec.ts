import { describe, expect, it } from 'vitest';

import {
  REVIEW_DUPLICATE_IDENTITY,
  REVIEW_OWNER_DELETE_LIFECYCLE,
  REVIEW_OWNER_EDIT_LIFECYCLE,
  REVIEW_PUBLICATION_DEFAULT,
  REVIEW_RETURN_EFFECT,
  ReviewEligibilityPolicy,
  type ReviewEligibilityEvidence,
} from './review-eligibility.policy';

describe('ReviewEligibilityPolicy', () => {
  const policy = new ReviewEligibilityPolicy();
  const delivered: ReviewEligibilityEvidence = {
    orderId: '10',
    productId: '20',
    orderStatus: 'completed',
    shippingStatus: 'delivered',
    completedAt: new Date('2026-08-21T04:00:00.000Z'),
    deliveredAt: new Date('2026-08-21T04:00:00.000Z'),
    hasActiveProduct: true,
  };

  it('uses Order + Product as the one canonical duplicate identity', () => {
    expect(policy.evaluate(delivered)).toEqual({
      eligible: true,
      duplicateIdentity: REVIEW_DUPLICATE_IDENTITY,
      identity: { orderId: '10', productId: '20' },
    });
  });

  it('requires both terminal states and persisted timestamps', () => {
    expect(policy.evaluate({ ...delivered, completedAt: null })).toEqual({
      eligible: false,
      reason: 'FULFILLMENT_NOT_COMPLETED',
    });
    expect(policy.evaluate({ ...delivered, shippingStatus: 'shipped' })).toEqual({
      eligible: false,
      reason: 'FULFILLMENT_NOT_COMPLETED',
    });
  });

  it('rejects a Product outside the Order and revoked fulfillment', () => {
    expect(policy.evaluate({ ...delivered, hasActiveProduct: false })).toEqual({
      eligible: false,
      reason: 'PRODUCT_NOT_IN_ORDER',
    });
    expect(
      policy.evaluate({ ...delivered, orderStatus: 'returned', shippingStatus: 'returned' }),
    ).toEqual({ eligible: false, reason: 'FULFILLMENT_REVOKED' });
  });

  it('keeps the approved future Review lifecycle explicit without creating persistence', () => {
    expect(REVIEW_PUBLICATION_DEFAULT).toBe('published');
    expect(REVIEW_OWNER_EDIT_LIFECYCLE).toBe('published_in_place');
    expect(REVIEW_OWNER_DELETE_LIFECYCLE).toBe('soft_delete');
    expect(REVIEW_RETURN_EFFECT).toBe('revoke_verified_purchase_keep_content');
  });
});
