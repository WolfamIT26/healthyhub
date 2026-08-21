import { describe, expect, it, vi } from 'vitest';

import { ProductService } from './product.service';

const product = {
  id: '1',
  productCode: 'HH-0001',
  name: 'Sữa yến mạch',
  slug: 'oat-milk-original',
  price: '69000.00',
  sellableStatus: 'sellable' as const,
  featured: true,
  createdAt: new Date('2026-08-01T00:00:00.000Z'),
  updatedAt: new Date('2026-08-13T00:00:00.000Z'),
  summary: 'Vị thanh nhẹ.',
  description: 'Mô tả persisted.',
  usageNote: 'Lắc đều.',
  storageNote: 'Bảo quản lạnh.',
  category: { id: '1', slug: 'plant-milk', name: 'Sữa hạt' },
  brand: { id: '1', slug: 'healthyhub-select', name: 'HealthyHub Select' },
  stockStatus: 'available' as const,
  availableQuantity: 10,
};
const relatedProduct = {
  ...product,
  id: '2',
  productCode: 'HH-0002',
  name: 'Sữa hạnh nhân',
  slug: 'almond-milk-unsweetened',
};

function setup() {
  const repository = {
    list: vi.fn().mockImplementation(async (query: { excludeProductId?: string }) => ({
      rows: query.excludeProductId ? [relatedProduct] : [product],
      total: 1,
    })),
    findPublic: vi.fn().mockResolvedValue(product),
    loadDetails: vi.fn().mockResolvedValue({
      tags: new Map([['1', ['vegan', 'lactose-free']]]),
      ingredients: new Map([
        [
          '1',
          [
            {
              name: 'Yến mạch',
              description: 'Thành phần nền.',
              nutritionNote: null,
              allergyWarning: 'Có chứa yến mạch.',
            },
          ],
        ],
      ]),
      nutrition: new Map([
        [
          '1',
          {
            servingSize: '250 ml',
            calories: '120 kcal',
            protein: '3 g',
            carbohydrates: '18 g',
            fat: '4 g',
            sugar: '6 g',
            note: null,
          },
        ],
      ]),
      media: new Map([
        [
          '1',
          [
            {
              id: '10',
              url: 'https://cdn.example.test/oat-milk.webp',
              role: 'primary',
              label: 'Ảnh chính',
            },
          ],
        ],
      ]),
    }),
    options: vi.fn().mockResolvedValue({
      categories: [product.category],
      brands: [product.brand],
      dietary: ['vegan'],
    }),
    categories: vi.fn().mockResolvedValue({
      rows: [{ ...product.category, description: null, displayOrder: 1, parent: null }],
      total: 1,
    }),
    brands: vi.fn().mockResolvedValue({
      rows: [{ ...product.brand, origin: null, description: null }],
      total: 1,
    }),
  };
  return { service: new ProductService(repository as never), repository };
}

describe('ProductService', () => {
  it('returns public paginated products from repository authority', async () => {
    const { service, repository } = setup();
    await expect(
      service.list({ page: 1, pageSize: 20, dietary: ['vegan'], sort: 'price-asc' }),
    ).resolves.toMatchObject({
      totalItems: 1,
      items: [
        {
          id: '1',
          price: '69000.00',
          availability: 'in_stock',
          dietaryTags: ['vegan', 'lactose-free'],
          ingredients: [],
        },
      ],
    });
    expect(repository.list).toHaveBeenCalledWith(
      expect.objectContaining({ dietary: ['vegan'], sort: 'price-asc' }),
    );
  });

  it('returns detail nutrition, ingredients, allergens and related products', async () => {
    const { service, repository } = setup();
    await expect(service.detail('oat-milk-original')).resolves.toMatchObject({
      id: '1',
      description: 'Mô tả persisted.',
      nutrition: { calories: '120 kcal' },
      ingredients: [{ name: 'Yến mạch' }],
      allergenInformation: ['Có chứa yến mạch.'],
      media: [{ id: '10', role: 'primary' }],
      relatedProducts: [{ id: '2' }],
    });
    expect(repository.list).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'plant-milk', excludeProductId: '1' }),
    );
  });

  it('rejects invalid price ranges and hides missing/inactive repository records', async () => {
    const { service, repository } = setup();
    await expect(
      service.list({
        page: 1,
        pageSize: 20,
        dietary: [],
        sort: 'featured',
        minPrice: 100,
        maxPrice: 10,
      }),
    ).rejects.toMatchObject({ status: 400 });
    repository.findPublic.mockResolvedValue(null);
    await expect(service.detail('hidden-product')).rejects.toMatchObject({
      status: 404,
      response: { code: 'NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND' },
    });
  });

  it('maps zero Inventory quantity to out of stock without exposing the quantity', async () => {
    const { service, repository } = setup();
    repository.findPublic.mockResolvedValue({
      ...product,
      stockStatus: 'available',
      availableQuantity: 0,
    });
    await expect(service.detail(product.slug)).resolves.toMatchObject({
      availability: 'out_of_stock',
      sellable: false,
    });
    await expect(service.detail(product.slug)).resolves.not.toHaveProperty('availableQuantity');
  });

  it.each([
    [{ stockStatus: 'disabled' as const, availableQuantity: 10 }, 'unavailable'],
    [{ stockStatus: null, availableQuantity: null }, 'unavailable'],
  ])('maps unavailable Inventory state without a public fallback', async (inventory, expected) => {
    const { service, repository } = setup();
    repository.findPublic.mockResolvedValue({ ...product, ...inventory });
    await expect(service.detail(product.slug)).resolves.toMatchObject({
      availability: expected,
      sellable: false,
    });
  });

  it('serves Category/Brand options without internal metadata', async () => {
    const { service } = setup();
    await expect(service.category('plant-milk')).resolves.toMatchObject(product.category);
    await expect(service.brand('healthyhub-select')).resolves.toMatchObject(product.brand);
    await expect(service.categoryTree()).resolves.toMatchObject([
      { ...product.category, children: [] },
    ]);
    await expect(service.categories({ page: 1, pageSize: 20 })).resolves.toMatchObject({
      totalItems: 1,
    });
    await expect(service.brands({ page: 1, pageSize: 20 })).resolves.toMatchObject({
      totalItems: 1,
    });
  });
});
