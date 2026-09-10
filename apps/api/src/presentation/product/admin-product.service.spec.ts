import { describe, expect, it, vi } from 'vitest';

import { AdminProductDataError } from '../../data/product/repositories';
import { AdminProductService } from './admin-product.service';

const auth = {
  userAccountId: '7',
  sessionId: '11',
  sessionPublicId: 'session',
  roles: ['ADMINISTRATOR'],
  permissionsVersion: 2,
} as never;

const aggregate = {
  name: ' Sữa hạt mới ',
  slug: 'new-nut-milk',
  price: '69000.00',
  brandId: '2',
  categoryIds: ['3'],
  primaryCategoryId: '3',
  featured: true,
  content: {
    description: ' Mô tả hợp lệ ',
    summary: '',
    usageNote: null,
    storageNote: null,
    seoTitle: null,
    seoDescription: null,
    status: 'published' as const,
  },
  nutrition: null,
  ingredients: [
    { name: ' Hạnh nhân ', description: '', nutritionNote: null, allergyWarning: null },
  ],
  dietaryTags: ['vegan'] as const,
  media: [{ mediaAssetId: '4', role: 'main' as const }],
};

const product = {
  id: '10',
  sku: 'HH-NEW',
  name: 'Sữa hạt mới',
  slug: 'new-nut-milk',
  price: '69000.00',
  productStatus: 'draft',
  visibility: 'hidden',
  sellableStatus: 'unavailable',
  availability: 'unavailable',
  featured: true,
  brand: { id: '2', name: 'HealthyHub', slug: 'healthyhub' },
  primaryCategory: { id: '3', name: 'Sữa hạt', slug: 'sua-hat' },
  categories: [{ id: '3', name: 'Sữa hạt', slug: 'sua-hat', visibility: 'public', primary: true }],
  content: {
    description: 'Mô tả hợp lệ',
    summary: null,
    usageNote: null,
    storageNote: null,
    seoTitle: null,
    seoDescription: null,
    status: 'published',
  },
  nutrition: null,
  ingredients: [
    { name: 'Hạnh nhân', description: null, nutritionNote: null, allergyWarning: null },
  ],
  dietaryTags: ['vegan'],
  media: [],
  createdAt: '2026-08-26T00:00:00.000Z',
  updatedAt: '2026-08-26T00:00:00.000Z',
  version: 1,
};

function setup() {
  const repository = {
    list: vi.fn().mockResolvedValue({ rows: [product], total: 1 }),
    detail: vi.fn().mockResolvedValue(product),
    options: vi.fn().mockResolvedValue({ categories: [], brands: [], dietaryTags: [], media: [] }),
    create: vi.fn().mockResolvedValue(product),
    update: vi.fn().mockResolvedValue({ ...product, version: 2 }),
    updateStatus: vi.fn().mockResolvedValue({
      ...product,
      productStatus: 'active',
      visibility: 'public',
      version: 2,
    }),
    softDelete: vi.fn().mockResolvedValue(undefined),
  };
  const audit = { emit: vi.fn() };
  return {
    service: new AdminProductService(repository as never, audit as never),
    repository,
    audit,
  };
}

describe('AdminProductService', () => {
  it('uses database pagination/filter authority in the canonical tenant', async () => {
    const { service, repository } = setup();
    await expect(
      service.list({ page: 2, pageSize: 20, q: ' milk ', sort: 'updated-desc' }),
    ).resolves.toMatchObject({ totalItems: 1, totalPages: 1 });
    expect(repository.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, q: 'milk' }),
      '1',
    );
  });

  it('normalizes a whitelisted create aggregate and audits only safe mutation metadata', async () => {
    const { service, repository, audit } = setup();
    await expect(service.create(auth, { ...aggregate, sku: ' hh-new ' } as never)).resolves.toEqual(
      {
        product,
        created: true,
      },
    );
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        sku: 'HH-NEW',
        name: 'Sữa hạt mới',
        content: expect.objectContaining({ summary: null }),
        ingredients: [expect.objectContaining({ name: 'Hạnh nhân', description: null })],
      }),
      { actorUserAccountId: '7', tenantId: '1' },
    );
    expect(audit.emit).toHaveBeenCalledWith('created', '7', '10', 1);
  });

  it('rejects duplicate normalized ingredients and an invalid primary Category before persistence', async () => {
    const { service, repository } = setup();
    await expect(
      service.create(auth, {
        ...aggregate,
        sku: 'HH-NEW',
        ingredients: [aggregate.ingredients[0], { ...aggregate.ingredients[0], name: 'hạnh nhân' }],
      } as never),
    ).rejects.toMatchObject({ status: 422 });
    await expect(
      service.create(auth, {
        ...aggregate,
        sku: 'HH-NEW',
        primaryCategoryId: '99',
      } as never),
    ).rejects.toMatchObject({ status: 422 });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it.each([
    ['VERSION_CONFLICT', 409, 'CONFLICT.PRODUCT.VERSION_CONFLICT'],
    ['DUPLICATE_IDENTITY', 409, 'CONFLICT.PRODUCT.SLUG_OR_SKU_EXISTS'],
    ['INVALID_BRAND', 422, 'VALIDATION.PRODUCT.INVALID_BRAND'],
    ['INVALID_CATEGORY', 422, 'VALIDATION.PRODUCT.INVALID_CATEGORY'],
    ['INVALID_MEDIA', 422, 'VALIDATION.PRODUCT.INVALID_MEDIA'],
    ['PUBLICATION_REQUIREMENTS', 422, 'BUSINESS.PRODUCT.PUBLICATION_REQUIREMENTS_NOT_MET'],
  ] as const)('maps %s to a safe typed error', async (code, status, errorCode) => {
    const { service, repository } = setup();
    repository.update.mockRejectedValue(new AdminProductDataError(code));
    await expect(
      service.update(auth, '10', { ...aggregate, version: 1 } as never),
    ).rejects.toMatchObject({ status, response: { code: errorCode } });
  });

  it('updates lifecycle and soft-deletes with optimistic version plus actor scope', async () => {
    const { service, repository, audit } = setup();
    await expect(
      service.updateStatus(auth, '10', {
        productStatus: 'active',
        visibility: 'public',
        version: 1,
      }),
    ).resolves.toMatchObject({ product: { visibility: 'public' } });
    await expect(service.delete(auth, '10', 2)).resolves.toEqual({
      productId: '10',
      deleted: true,
    });
    expect(repository.softDelete).toHaveBeenCalledWith('10', 2, {
      actorUserAccountId: '7',
      tenantId: '1',
    });
    expect(audit.emit).toHaveBeenCalledWith('deleted', '7', '10', 2);
  });
});
