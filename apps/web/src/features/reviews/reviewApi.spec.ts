import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '../../services/api/httpClient';
import { reviewApi } from './reviewApi';

vi.mock('../../services/api/httpClient', () => ({
  httpClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

describe('reviewApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads authoritative public list and summary endpoints', async () => {
    vi.mocked(httpClient.get)
      .mockResolvedValueOnce({ data: { data: { items: [], page: 2 } } })
      .mockResolvedValueOnce({ data: { data: { totalReviews: 3 } } });

    await expect(reviewApi.listPublic('4', 2, 5)).resolves.toMatchObject({ page: 2 });
    await expect(reviewApi.summary('4')).resolves.toMatchObject({ totalReviews: 3 });
    expect(httpClient.get).toHaveBeenNthCalledWith(
      1,
      '/public/products/4/reviews',
      expect.objectContaining({ params: { page: 2, pageSize: 5 } }),
    );
    expect(httpClient.get).toHaveBeenNthCalledWith(
      2,
      '/public/products/4/reviews/summary',
      expect.any(Object),
    );
  });

  it('sends only canonical Review fields for owner mutations', async () => {
    vi.mocked(httpClient.post).mockResolvedValue({ data: { data: { reviewId: '1' } } });
    const body = { orderId: '8', productId: '4', rating: 5, content: 'Rất tốt' };
    await reviewApi.create(body);
    expect(httpClient.post).toHaveBeenCalledWith('/me/reviews', body);
    expect(vi.mocked(httpClient.post).mock.calls[0][1]).not.toHaveProperty('customerId');
    expect(vi.mocked(httpClient.post).mock.calls[0][1]).not.toHaveProperty('verifiedPurchase');
  });
});
