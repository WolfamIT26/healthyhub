import { describe, expect, it, vi } from 'vitest';

import { EnableProductCatalogAuthorityV11760000010000 } from './1760000010000-enable-product-catalog-authority-v1';
import { EnableCategoryPublicDisplayV11760000011000 } from './1760000011000-enable-category-public-display-v1';
import { EnforceProductPrimaryCategoryV11760000012000 } from './1760000012000-enforce-product-primary-category-v1';

describe('Product Catalog authority V1 migration', () => {
  it('creates approved Product/Category/Brand/content public-read tables', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableProductCatalogAuthorityV11760000010000().up({ query } as never);
    const sql = query.mock.calls.map(([statement]) => statement).join('\n');
    for (const table of [
      'brands',
      'categories',
      'product_category_links',
      'product_contents',
      'product_ingredients',
      'product_dietary_tags',
      'product_nutrition_facts',
      'media_assets',
      'product_media_links',
    ])
      expect(sql).toContain(`CREATE TABLE ${table}`);
    expect(sql).toContain('fk_products_brand');
  });

  it('drops dependent tables before Category and Brand', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableProductCatalogAuthorityV11760000010000().down({ query } as never);
    const statements = query.mock.calls.map(([sql]) => sql);
    expect(statements[0]).toBe('DROP TABLE IF EXISTS product_media_links');
    expect(statements.at(-1)).toBe('DROP TABLE IF EXISTS brands');
  });

  it('adds the approved public Category display-order authority', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnableCategoryPublicDisplayV11760000011000().up({ query } as never);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE category_display_rules'),
    );
    expect(query).toHaveBeenCalledWith(expect.stringContaining('effective_to > effective_from'));
  });

  it('enforces at most one active primary Category per Product', async () => {
    const query = vi.fn().mockResolvedValue(undefined);
    await new EnforceProductPrimaryCategoryV11760000012000().up({ query } as never);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('active_primary_product_id'));
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('uq_product_category_one_active_primary'),
    );
  });
});
