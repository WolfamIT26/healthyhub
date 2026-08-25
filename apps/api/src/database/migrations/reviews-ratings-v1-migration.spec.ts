import { describe, expect, it, vi } from 'vitest';

import { EnableReviewsRatingsV11760000015000 } from './1760000015000-enable-reviews-ratings-v1';

describe('Reviews and ratings V1 migration', () => {
  it('creates one durable Review identity per Order and Product', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableReviewsRatingsV11760000015000().up({ query } as never);
    const sql = query.mock.calls.map(([statement]) => statement as string).join('\n');

    expect(sql).toContain('CREATE TABLE product_reviews');
    expect(sql).toContain('UNIQUE (tenant_id, order_id, product_id)');
    expect(sql).toContain('rating BETWEEN 1 AND 5');
    expect(sql).toContain('CHAR_LENGTH(TRIM(review_content)) BETWEEN 3 AND 2000');
    expect(sql).toContain("review_status IN ('published','hidden','rejected')");
    expect(sql).toContain('fk_product_reviews_customer');
    expect(sql).toContain('idx_product_reviews_public');
  });

  it('drops only the Review table on rollback', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableReviewsRatingsV11760000015000().down({ query } as never);
    expect(query).toHaveBeenCalledWith('DROP TABLE IF EXISTS `product_reviews`');
  });
});
