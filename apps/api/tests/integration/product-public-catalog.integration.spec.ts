import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as brandEntities from '../../src/data/brand/entities';
import { BrandEntity } from '../../src/data/brand/entities';
import * as categoryEntities from '../../src/data/category/entities';
import {
  CategoryDisplayRuleEntity,
  CategoryEntity,
  ProductCategoryLinkEntity,
} from '../../src/data/category/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { InventoryItemEntity } from '../../src/data/inventory/entities';
import * as mediaEntities from '../../src/data/media/entities';
import {
  ProductContentEntity,
  ProductDietaryTagEntity,
  ProductEntity,
  ProductIngredientEntity,
  ProductNutritionFactEntity,
} from '../../src/data/product/entities';
import * as productEntities from '../../src/data/product/entities';
import { TypeOrmPublicProductRepository } from '../../src/data/product/repositories';
import { CreateUserIdentityFoundation1760000000000 } from '../../src/database/migrations/1760000000000-create-user-identity-foundation';
import { CreateAuthenticationData1760000001000 } from '../../src/database/migrations/1760000001000-create-authentication-data';
import { CreateCartDependencyFoundation1760000002000 } from '../../src/database/migrations/1760000002000-create-cart-dependency-foundation';
import { CreateCartPersistence1760000003000 } from '../../src/database/migrations/1760000003000-create-cart-persistence';
import { CreateOrderCreationFoundation1760000004000 } from '../../src/database/migrations/1760000004000-create-order-creation-foundation';
import { CreatePaymentProviderEvents1760000005000 } from '../../src/database/migrations/1760000005000-create-payment-provider-events';
import { EnableVnpaySandbox1760000006000 } from '../../src/database/migrations/1760000006000-enable-vnpay-sandbox';
import { EnableOrderConfirmation1760000007000 } from '../../src/database/migrations/1760000007000-enable-order-confirmation';
import { EnableCustomerProfileAddressV11760000008000 } from '../../src/database/migrations/1760000008000-enable-customer-profile-address-v1';
import { EnableWishlistPersistenceV11760000009000 } from '../../src/database/migrations/1760000009000-enable-wishlist-persistence-v1';
import { EnableProductCatalogAuthorityV11760000010000 } from '../../src/database/migrations/1760000010000-enable-product-catalog-authority-v1';
import { EnableCategoryPublicDisplayV11760000011000 } from '../../src/database/migrations/1760000011000-enable-category-public-display-v1';
import { EnforceProductPrimaryCategoryV11760000012000 } from '../../src/database/migrations/1760000012000-enforce-product-primary-category-v1';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';
import { ProductService } from '../../src/presentation/product/product.service';

const enabled = process.env.PRODUCT_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Product public catalog MySQL integration', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      ...createTypeOrmOptions(
        getValidatedEnvironment({ ...process.env, PAYMENT_PROVIDER: 'not_configured' }),
      ),
      migrations: [
        CreateUserIdentityFoundation1760000000000,
        CreateAuthenticationData1760000001000,
        CreateCartDependencyFoundation1760000002000,
        CreateCartPersistence1760000003000,
        CreateOrderCreationFoundation1760000004000,
        CreatePaymentProviderEvents1760000005000,
        EnableVnpaySandbox1760000006000,
        EnableOrderConfirmation1760000007000,
        EnableCustomerProfileAddressV11760000008000,
        EnableWishlistPersistenceV11760000009000,
        EnableProductCatalogAuthorityV11760000010000,
        EnableCategoryPublicDisplayV11760000011000,
        EnforceProductPrimaryCategoryV11760000012000,
      ],
      entities: [
        ...Object.values(brandEntities),
        ...Object.values(categoryEntities),
        ...Object.values(inventoryEntities),
        ...Object.values(mediaEntities),
        ...Object.values(productEntities),
      ],
    });
    await dataSource.initialize();
    await dataSource.runMigrations();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('serves persisted list/detail data with server filters and Inventory availability', async () => {
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const brands = dataSource.getRepository(BrandEntity);
    const categories = dataSource.getRepository(CategoryEntity);
    const products = dataSource.getRepository(ProductEntity);
    const categoryDisplayRules = dataSource.getRepository(CategoryDisplayRuleEntity);
    const categoryLinks = dataSource.getRepository(ProductCategoryLinkEntity);
    const contents = dataSource.getRepository(ProductContentEntity);
    const inventory = dataSource.getRepository(InventoryItemEntity);
    const tags = dataSource.getRepository(ProductDietaryTagEntity);
    const ingredients = dataSource.getRepository(ProductIngredientEntity);
    const nutrition = dataSource.getRepository(ProductNutritionFactEntity);
    const brand = await brands.save(
      brands.create({
        tenantId: '1',
        brandName: `Catalog Integration ${suffix}`,
        brandSlug: `catalog-brand-${suffix}`,
        brandOrigin: 'Việt Nam',
        brandStatus: 'active',
        description: null,
      }),
    );
    const category = await categories.save(
      categories.create({
        tenantId: '1',
        categoryName: `Catalog Category ${suffix}`,
        slug: `catalog-category-${suffix}`,
        description: null,
        parentCategoryId: null,
        categoryStatus: 'active',
        categoryVisibility: 'public',
      }),
    );
    await categoryDisplayRules.save(
      categoryDisplayRules.create({
        tenantId: '1',
        categoryId: category.id,
        displayChannel: 'web',
        displayOrder: 7,
        ruleStatus: 'active',
        effectiveFrom: new Date('2026-01-01T00:00:00.000Z'),
        effectiveTo: null,
      }),
    );
    const createdProducts = await products.save([
      products.create({
        tenantId: '1',
        brandId: brand.id,
        productCode: `CAT-HIGH-${suffix}`,
        productName: `Sữa yến mạch Integration ${suffix}`,
        slug: `catalog-high-${suffix}`,
        basePrice: '120000.00',
        sellableStatus: 'sellable',
        productVisibility: 'public',
        productStatus: 'active',
        isFeatured: true,
      }),
      products.create({
        tenantId: '1',
        brandId: brand.id,
        productCode: `CAT-LOW-${suffix}`,
        productName: `Sữa hạt ít đường Integration ${suffix}`,
        slug: `catalog-low-${suffix}`,
        basePrice: '80000.00',
        sellableStatus: 'sellable',
        productVisibility: 'public',
        productStatus: 'active',
        isFeatured: false,
      }),
      products.create({
        tenantId: '1',
        brandId: brand.id,
        productCode: `CAT-HIDDEN-${suffix}`,
        productName: `Hidden Integration ${suffix}`,
        slug: `catalog-hidden-${suffix}`,
        basePrice: '50000.00',
        sellableStatus: 'sellable',
        productVisibility: 'hidden',
        productStatus: 'active',
        isFeatured: false,
      }),
    ]);
    const productIds = createdProducts.map((product) => product.id);
    await categoryLinks.save(
      createdProducts.map((product) =>
        categoryLinks.create({
          tenantId: '1',
          productId: product.id,
          categoryId: category.id,
          isPrimary: true,
          linkStatus: 'active',
          linkedAt: new Date(),
        }),
      ),
    );
    await contents.save(
      createdProducts.map((product) =>
        contents.create({
          tenantId: '1',
          productId: product.id,
          summary: `Tóm tắt ${product.productName}`,
          description: `Mô tả persisted ${product.productName}`,
          usageNote: 'Dùng lạnh.',
          storageNote: 'Bảo quản lạnh.',
          seoTitle: null,
          seoDescription: null,
          contentStatus: 'published',
        }),
      ),
    );
    await inventory.save([
      inventory.create({
        tenantId: '1',
        productId: createdProducts[0].id,
        availableQuantity: 20,
        reservedQuantity: 0,
        stockThreshold: 5,
        stockStatus: 'available',
      }),
      inventory.create({
        tenantId: '1',
        productId: createdProducts[1].id,
        availableQuantity: 2,
        reservedQuantity: 0,
        stockThreshold: 5,
        stockStatus: 'low_stock',
      }),
      inventory.create({
        tenantId: '1',
        productId: createdProducts[2].id,
        availableQuantity: 10,
        reservedQuantity: 0,
        stockThreshold: 5,
        stockStatus: 'available',
      }),
    ]);
    await tags.save([
      tags.create({ tenantId: '1', productId: createdProducts[0].id, dietaryTag: 'vegan' }),
      tags.create({
        tenantId: '1',
        productId: createdProducts[0].id,
        dietaryTag: 'gluten-free',
      }),
      tags.create({ tenantId: '1', productId: createdProducts[1].id, dietaryTag: 'vegan' }),
      tags.create({
        tenantId: '1',
        productId: createdProducts[1].id,
        dietaryTag: 'low-sugar',
      }),
    ]);
    await ingredients.save(
      ingredients.create({
        tenantId: '1',
        productId: createdProducts[0].id,
        ingredientName: 'Yến mạch nguyên hạt',
        ingredientDescription: 'Nguồn nguyên liệu chính.',
        nutritionNote: 'Cung cấp chất xơ.',
        allergyWarning: 'Có chứa yến mạch.',
        displayOrder: 1,
      }),
    );
    await nutrition.save(
      nutrition.create({
        tenantId: '1',
        productId: createdProducts[0].id,
        servingSize: '250 ml',
        calories: '120 kcal',
        protein: '3 g',
        carbohydrates: '18 g',
        fat: '4 g',
        sugar: '5 g',
        note: 'Theo khẩu phần.',
      }),
    );
    const service = new ProductService(new TypeOrmPublicProductRepository(dataSource));

    try {
      const filtered = await service.list({
        page: 1,
        pageSize: 1,
        q: 'Integration',
        category: category.slug,
        brand: brand.brandSlug,
        dietary: ['vegan'],
        minPrice: 70000,
        maxPrice: 130000,
        sort: 'price-asc',
      });
      expect(filtered).toMatchObject({
        page: 1,
        pageSize: 1,
        totalItems: 2,
        totalPages: 2,
        items: [{ id: createdProducts[1].id, availability: 'low_stock', price: '80000.00' }],
      });
      const allDietary = await service.list({
        page: 1,
        pageSize: 20,
        category: category.slug,
        dietary: ['vegan', 'gluten-free'],
        sort: 'featured',
      });
      expect(allDietary.items.map((product) => product.id)).toEqual([createdProducts[0].id]);
      const byIngredient = await service.list({
        page: 1,
        pageSize: 20,
        q: 'Yến mạch nguyên hạt',
        dietary: [],
        sort: 'featured',
      });
      expect(byIngredient.items.map((product) => product.id)).toContain(createdProducts[0].id);
      const detail = await service.detail(createdProducts[0].slug);
      expect(detail).toMatchObject({
        id: createdProducts[0].id,
        description: expect.stringContaining('Mô tả persisted'),
        nutrition: { servingSize: '250 ml', calories: '120 kcal' },
        ingredients: [{ name: 'Yến mạch nguyên hạt' }],
        allergenInformation: ['Có chứa yến mạch.'],
      });
      expect(detail.relatedProducts.every((item) => item.id !== createdProducts[0].id)).toBe(true);
      await expect(service.detail(createdProducts[2].slug)).rejects.toMatchObject({ status: 404 });
      const categoryDirectory = await service.categories({ page: 1, pageSize: 20 });
      expect(categoryDirectory.items).toContainEqual(
        expect.objectContaining({ id: category.id, displayOrder: 7 }),
      );
      const brandDirectory = await service.brands({ page: 1, pageSize: 20 });
      expect(brandDirectory.items).toContainEqual(
        expect.objectContaining({ id: brand.id, origin: 'Việt Nam' }),
      );
    } finally {
      await nutrition.delete({ productId: createdProducts[0].id });
      await ingredients.delete({ productId: createdProducts[0].id });
      await tags.delete(productIds.map((productId) => ({ productId })));
      await inventory.delete(productIds.map((productId) => ({ productId })));
      await contents.delete(productIds.map((productId) => ({ productId })));
      await categoryLinks.delete(productIds.map((productId) => ({ productId })));
      await products.delete(productIds);
      await categoryDisplayRules.delete({ categoryId: category.id });
      await categories.delete(category.id);
      await brands.delete(brand.id);
    }
  });
});
