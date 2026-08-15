import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '../../services/api/httpClient';
import { productApi } from './productApi';

vi.mock('../../services/api/httpClient', () => ({ httpClient: { get: vi.fn() } }));

const serverProduct = {
  id: '42',
  slug: 'persisted-product',
  sku: 'HH-0042',
  name: 'Persisted Product',
  shortDescription: 'Persisted summary',
  description: 'Persisted description',
  usageNote: 'Dùng lạnh',
  storageNote: 'Bảo quản lạnh',
  category: { id: '3', slug: 'plant-milk', name: 'Sữa hạt' },
  brand: { id: '4', slug: 'healthyhub-select', name: 'HealthyHub Select' },
  price: '69000.00',
  currency: 'VND' as const,
  availability: 'low_stock' as const,
  sellable: true,
  featured: true,
  dietaryTags: ['vegan' as const],
  ingredients: [
    { name: 'Yến mạch', description: 'Thành phần nền', nutritionNote: 'Nguồn chất xơ' },
  ],
  allergenInformation: ['Có chứa yến mạch.'],
  nutrition: {
    servingSize: '250 ml',
    calories: '120 kcal',
    protein: '3 g',
    carbohydrates: '18 g',
    fat: '4 g',
    sugar: '6 g',
    note: null,
  },
  media: [
    {
      id: '9',
      url: 'https://cdn.example.test/persisted-product.webp',
      role: 'primary',
      label: 'Ảnh chính',
    },
  ],
  createdAt: '2026-08-13T00:00:00.000Z',
  updatedAt: '2026-08-13T00:00:00.000Z',
};

describe('productApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps the authoritative Product detail, media, nutrition and availability', async () => {
    vi.mocked(httpClient.get).mockResolvedValue({
      data: { data: { ...serverProduct, relatedProducts: [] } },
    });

    await expect(productApi.detail('persisted-product')).resolves.toMatchObject({
      product: {
        id: '42',
        price: 69000,
        stockStatus: 'low_stock',
        sellable: true,
        dietaryTags: ['vegan'],
        nutrition: { calories: '120 kcal' },
        ingredients: [{ name: 'Yến mạch', description: 'Thành phần nền' }],
        allergenInformation: 'Có chứa yến mạch.',
        thumbnail: 'https://cdn.example.test/persisted-product.webp',
        images: [{ id: '9', src: 'https://cdn.example.test/persisted-product.webp' }],
      },
    });
    expect(httpClient.get).toHaveBeenCalledWith('/public/products/persisted-product', {
      signal: undefined,
    });
  });

  it('sends the approved server-side list query without internal fields', async () => {
    vi.mocked(httpClient.get).mockResolvedValue({
      data: {
        data: { items: [serverProduct], page: 2, pageSize: 12, totalItems: 13, totalPages: 2 },
      },
    });

    await productApi.list({
      search: 'yến mạch',
      category: 'plant-milk',
      brand: 'healthyhub-select',
      dietary: ['vegan'],
      minPrice: 50000,
      maxPrice: 100000,
      availability: 'low_stock',
      sort: 'price-asc',
      page: 2,
      limit: 12,
    });

    expect(httpClient.get).toHaveBeenCalledWith(
      '/public/products',
      expect.objectContaining({
        params: expect.objectContaining({
          page: 2,
          pageSize: 12,
          q: 'yến mạch',
          category: 'plant-milk',
          dietary: 'vegan',
          sort: 'price-asc',
        }),
      }),
    );
  });
});
