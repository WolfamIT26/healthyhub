import { HttpStatus } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import type { ProductReviewEntity } from '../../data/review/entities';
import type { ReviewRepository } from '../../data/review/repositories';
import { ReviewException } from './review.exception';
import { ReviewService } from './review.service';

const auth: AuthenticatedRequestContext = {
  userAccountId: '7',
  sessionId: 'session-1',
  sessionPublicId: 'public-session-1',
  roles: ['CUSTOMER'],
  permissionsVersion: 1,
};

function review(overrides: Partial<ProductReviewEntity> = {}): ProductReviewEntity {
  return {
    id: '31',
    tenantId: '1',
    customerProfileId: '9',
    productId: '4',
    orderId: '12',
    rating: 5,
    reviewContent: 'Sản phẩm tốt',
    reviewStatus: 'published',
    submittedAt: new Date('2026-08-21T01:00:00.000Z'),
    publishedAt: new Date('2026-08-21T01:00:00.000Z'),
    createdAt: new Date('2026-08-21T01:00:00.000Z'),
    updatedAt: new Date('2026-08-21T01:00:00.000Z'),
    deletedAt: null,
    createdBy: '7',
    updatedBy: '7',
    deletedBy: null,
    version: 1,
    ...overrides,
  };
}

describe('ReviewService', () => {
  let repository: Record<keyof ReviewRepository, ReturnType<typeof vi.fn>>;
  let service: ReviewService;

  beforeEach(() => {
    repository = {
      listPublic: vi.fn(),
      summarizePublic: vi.fn(),
      listOwned: vi.fn(),
      findReviewOpportunity: vi.fn(),
      hasReviewIdentity: vi.fn(),
      create: vi.fn(),
      updateOwned: vi.fn(),
      deleteOwned: vi.fn(),
    };
    service = new ReviewService(
      repository as unknown as ReviewRepository,
      { resolve: vi.fn().mockResolvedValue({ customerProfileId: '9' }) } as never,
      {
        getProductCommerceSnapshot: vi.fn().mockResolvedValue({ publiclyVisible: true }),
      } as never,
    );
  });

  it('creates an eligible Review with server-derived ownership', async () => {
    repository.create.mockResolvedValue({ outcome: 'created', review: review() });
    const result = await service.create(auth, {
      orderId: '12',
      productId: '4',
      rating: 5,
      content: 'Sản phẩm tốt',
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ customerProfileId: '9', actorUserAccountId: '7' }),
    );
    expect(result).toMatchObject({ reviewId: '31', created: true, rating: 5 });
    expect(result).not.toHaveProperty('customerProfileId');
    expect(result).not.toHaveProperty('orderId');
  });

  it('returns the same Review for an exact retry and rejects a conflicting duplicate', async () => {
    repository.create.mockResolvedValueOnce({ outcome: 'idempotent', review: review() });
    await expect(
      service.create(auth, {
        orderId: '12',
        productId: '4',
        rating: 5,
        content: 'Sản phẩm tốt',
      }),
    ).resolves.toMatchObject({ created: false, reviewId: '31' });

    repository.create.mockResolvedValueOnce({ outcome: 'duplicate' });
    await expect(
      service.create(auth, {
        orderId: '12',
        productId: '4',
        rating: 4,
        content: 'Nội dung khác',
      }),
    ).rejects.toMatchObject({ status: HttpStatus.CONFLICT });
  });

  it.each([
    'ORDER_NOT_FOUND_OR_NOT_OWNED',
    'PRODUCT_NOT_IN_ORDER',
    'FULFILLMENT_NOT_COMPLETED',
    'FULFILLMENT_REVOKED',
  ] as const)('fails closed for eligibility reason %s', async (reason) => {
    repository.create.mockResolvedValue({ outcome: 'ineligible', reason });
    await expect(
      service.create(auth, {
        orderId: '12',
        productId: '4',
        rating: 5,
        content: 'Sản phẩm tốt',
      }),
    ).rejects.toMatchObject({ status: HttpStatus.FORBIDDEN });
  });

  it('does not leak whether a non-owned Review exists', async () => {
    repository.updateOwned.mockResolvedValue(null);
    await expect(service.update(auth, '31', { rating: 4 })).rejects.toSatisfy(
      (error: ReviewException) =>
        error.getStatus() === HttpStatus.NOT_FOUND &&
        (error.getResponse() as { code: string }).code === 'NOT_FOUND.REVIEW.REVIEW_NOT_FOUND',
    );
  });

  it('rejects an empty patch command', async () => {
    await expect(service.update(auth, '31', {})).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
    });
    expect(repository.updateOwned).not.toHaveBeenCalled();
  });

  it('returns only public-safe fields and dynamic verified evidence', async () => {
    repository.listPublic.mockResolvedValue({
      rows: [{ review: review(), verifiedPurchase: false }],
      total: 1,
    });
    const result = await service.listPublic('4', { page: 1, pageSize: 10 });
    expect(result.items[0]).toEqual(
      expect.objectContaining({
        authorDisplayName: 'Khách hàng HealthyHub',
        verifiedPurchase: false,
      }),
    );
    expect(result.items[0]).not.toHaveProperty('customerProfileId');
    expect(result.items[0]).not.toHaveProperty('orderId');
  });

  it('returns an eligible unused fulfilled Order opportunity', async () => {
    repository.listOwned.mockResolvedValue({ rows: [], total: 0 });
    repository.findReviewOpportunity.mockResolvedValue({
      orderId: '12',
      completedAt: new Date('2026-08-20T01:00:00.000Z'),
    });
    const result = await service.listMine(auth, { page: 1, pageSize: 10, productId: '4' });
    expect(result.eligibility).toEqual({
      eligible: true,
      reason: 'ELIGIBLE',
      orderId: '12',
      completedAt: '2026-08-20T01:00:00.000Z',
    });
  });
});
