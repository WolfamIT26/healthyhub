import { DataSource, In } from 'typeorm';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import { BrandEntity } from '../../src/data/brand/entities';
import * as brandEntities from '../../src/data/brand/entities';
import * as cartEntities from '../../src/data/cart/entities';
import { CategoryEntity, ProductCategoryLinkEntity } from '../../src/data/category/entities';
import * as categoryEntities from '../../src/data/category/entities';
import * as customerEntities from '../../src/data/customer/entities';
import { InventoryItemEntity } from '../../src/data/inventory/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import { MediaAssetEntity } from '../../src/data/media/entities';
import * as mediaEntities from '../../src/data/media/entities';
import * as orderEntities from '../../src/data/order/entities';
import * as paymentEntities from '../../src/data/payment/entities';
import {
  ProductContentEntity,
  ProductDietaryTagEntity,
  ProductEntity,
  ProductIngredientEntity,
  ProductMediaLinkEntity,
  ProductNutritionFactEntity,
} from '../../src/data/product/entities';
import * as productEntities from '../../src/data/product/entities';
import {
  TypeOrmAdminProductRepository,
  TypeOrmPublicProductRepository,
} from '../../src/data/product/repositories';
import * as reviewEntities from '../../src/data/review/entities';
import * as shippingEntities from '../../src/data/shipping/entities';
import * as userEntities from '../../src/data/user/entities';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';

const enabled = process.env.ADMIN_PRODUCT_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Admin Product Management MySQL integration', () => {
  let dataSource: DataSource;
  let repository: TypeOrmAdminProductRepository;
  let publicRepository: TypeOrmPublicProductRepository;
  const created = {
    productIds: [] as string[],
    categoryIds: [] as string[],
    brandIds: [] as string[],
    mediaIds: [] as string[],
  };

  beforeAll(async () => {
    dataSource = new DataSource({
      ...createTypeOrmOptions(
        getValidatedEnvironment({ ...process.env, PAYMENT_PROVIDER: 'not_configured' }),
      ),
      migrations: [],
      entities: [
        ...Object.values(authenticationEntities),
        ...Object.values(brandEntities),
        ...Object.values(cartEntities),
        ...Object.values(categoryEntities),
        ...Object.values(customerEntities),
        ...Object.values(inventoryEntities),
        ...Object.values(mediaEntities),
        ...Object.values(orderEntities),
        ...Object.values(paymentEntities),
        ...Object.values(productEntities),
        ...Object.values(reviewEntities),
        ...Object.values(shippingEntities),
        ...Object.values(userEntities),
      ],
    });
    await dataSource.initialize();
    repository = new TypeOrmAdminProductRepository(dataSource);
    publicRepository = new TypeOrmPublicProductRepository(dataSource);
  });

  afterEach(async () => cleanup());
  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('creates and replaces the canonical aggregate, then controls Public Catalog visibility', async () => {
    const fixture = await relations('aggregate');
    const input = aggregateInput(fixture, 'aggregate');
    const createdProduct = await repository.create(input, context());
    created.productIds.push(createdProduct.id);

    expect(createdProduct).toMatchObject({
      sku: input.sku,
      productStatus: 'draft',
      visibility: 'hidden',
      sellableStatus: 'unavailable',
      primaryCategory: { id: fixture.categories[0].id },
      content: { status: 'published' },
      ingredients: [{ name: 'Hạnh nhân' }],
      dietaryTags: ['vegan'],
      media: [{ mediaAssetId: fixture.media.id, role: 'main' }],
    });
    expect(
      await dataSource.getRepository(InventoryItemEntity).findOneBy({
        tenantId: '1',
        productId: createdProduct.id,
      }),
    ).toBeNull();
    await expect(publicRepository.findPublic(createdProduct.id)).resolves.toBeNull();

    const published = await repository.updateStatus(
      createdProduct.id,
      { productStatus: 'active', visibility: 'public', version: createdProduct.version },
      context(),
    );
    await expect(publicRepository.findPublic(createdProduct.id)).resolves.toMatchObject({
      id: createdProduct.id,
      productCode: input.sku,
      category: { id: fixture.categories[0].id },
    });

    const updated = await repository.update(
      createdProduct.id,
      {
        ...input,
        name: 'Product đã cập nhật',
        slug: `${input.slug}-updated`,
        categoryIds: fixture.categories.map((item) => item.id),
        primaryCategoryId: fixture.categories[1].id,
        ingredients: [
          { name: 'Yến mạch', description: null, nutritionNote: null, allergyWarning: null },
        ],
        dietaryTags: ['organic'],
        media: [{ mediaAssetId: fixture.media.id, role: 'gallery' }],
        version: published.version,
      },
      context(),
    );
    expect(updated).toMatchObject({
      name: 'Product đã cập nhật',
      primaryCategory: { id: fixture.categories[1].id },
      ingredients: [{ name: 'Yến mạch' }],
      dietaryTags: ['organic'],
      media: [{ role: 'gallery' }],
    });
    expect(updated.categories.filter((item) => item.primary)).toHaveLength(1);
    const publicProduct = await publicRepository.findPublic(updated.id);
    expect(publicProduct).toMatchObject({
      slug: `${input.slug}-updated`,
      category: { id: fixture.categories[1].id },
    });

    const list = await repository.list(
      {
        page: 1,
        pageSize: 20,
        q: 'Product đã cập nhật',
        productStatus: 'active',
        visibility: 'public',
        categoryId: fixture.categories[1].id,
        brandId: fixture.brand.id,
        sort: 'price-desc',
      },
      '1',
    );
    expect(list.rows.map((item) => item.id)).toContain(updated.id);
  });

  it('rejects stale updates and concurrent duplicate SKU/slug without partial aggregate rows', async () => {
    const fixture = await relations('concurrency');
    const input = aggregateInput(fixture, 'concurrency');
    const product = await repository.create(input, context());
    created.productIds.push(product.id);

    const updated = await repository.update(
      product.id,
      { ...input, name: 'First update', version: product.version },
      context(),
    );
    await expect(
      repository.update(
        product.id,
        { ...input, name: 'Stale update', version: product.version },
        context(),
      ),
    ).rejects.toEqual(expect.objectContaining({ code: 'VERSION_CONFLICT' }));
    expect((await repository.detail(product.id, '1'))?.name).toBe('First update');

    const duplicateInput = aggregateInput(fixture, `duplicate-${Date.now()}`);
    const outcomes = await Promise.allSettled([
      repository.create(duplicateInput, context()),
      repository.create(duplicateInput, context()),
    ]);
    const successful = outcomes.filter((outcome) => outcome.status === 'fulfilled');
    const failed = outcomes.filter((outcome) => outcome.status === 'rejected');
    expect(successful).toHaveLength(1);
    expect(failed).toHaveLength(1);
    const duplicate = successful[0] as PromiseFulfilledResult<AdminProductDetailForTest>;
    created.productIds.push(duplicate.value.id);
    expect((failed[0] as PromiseRejectedResult).reason).toEqual(
      expect.objectContaining({ code: 'DUPLICATE_IDENTITY' }),
    );
    expect(
      await dataSource.getRepository(ProductContentEntity).countBy({
        tenantId: '1',
        productId: duplicate.value.id,
      }),
    ).toBe(1);
    expect(updated.version).toBeGreaterThan(product.version);
  });

  it('denies cross-tenant/stale relations and rolls back Product creation', async () => {
    const fixture = await relations('tenant');
    const foreign = await dataSource.getRepository(CategoryEntity).save(
      dataSource.getRepository(CategoryEntity).create({
        tenantId: '2',
        categoryName: `Foreign ${Date.now()}`,
        slug: `foreign-${Date.now()}`,
        description: null,
        parentCategoryId: null,
        categoryStatus: 'active',
        categoryVisibility: 'public',
      }),
    );
    created.categoryIds.push(foreign.id);
    const input = {
      ...aggregateInput(fixture, 'tenant-denied'),
      categoryIds: [foreign.id],
      primaryCategoryId: foreign.id,
    };
    await expect(repository.create(input, context())).rejects.toEqual(
      expect.objectContaining({ code: 'INVALID_CATEGORY' }),
    );
    expect(
      await dataSource
        .getRepository(ProductEntity)
        .countBy({ tenantId: '1', productCode: input.sku }),
    ).toBe(0);
  });

  it('soft-deletes Product without cascading Inventory and serializes delete/update race', async () => {
    const fixture = await relations('delete');
    const input = aggregateInput(fixture, 'delete');
    const product = await repository.create(input, context());
    created.productIds.push(product.id);
    const inventory = await dataSource.getRepository(InventoryItemEntity).save(
      dataSource.getRepository(InventoryItemEntity).create({
        tenantId: '1',
        productId: product.id,
        availableQuantity: 3,
        reservedQuantity: 0,
        stockThreshold: 1,
        stockStatus: 'available',
      }),
    );

    const outcomes = await Promise.allSettled([
      repository.softDelete(product.id, product.version, context()),
      repository.update(
        product.id,
        { ...input, name: 'Racing update', version: product.version },
        context(),
      ),
    ]);
    expect(outcomes.filter((outcome) => outcome.status === 'fulfilled')).toHaveLength(1);
    const persisted = await dataSource.getRepository(ProductEntity).findOne({
      where: { id: product.id },
      withDeleted: true,
    });
    if (!persisted?.deletedAt) {
      await repository.softDelete(product.id, persisted!.version, context());
    }
    await expect(publicRepository.findPublic(product.id)).resolves.toBeNull();
    await expect(
      dataSource.getRepository(InventoryItemEntity).findOneBy({ id: inventory.id }),
    ).resolves.toMatchObject({ productId: product.id, availableQuantity: 3 });
  });

  async function relations(label: string) {
    const suffix = `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const brand = await dataSource.getRepository(BrandEntity).save(
      dataSource.getRepository(BrandEntity).create({
        tenantId: '1',
        brandName: `Brand ${suffix}`,
        brandSlug: `brand-${suffix}`.slice(0, 191),
        brandOrigin: 'VN',
        brandStatus: 'active',
        description: null,
      }),
    );
    created.brandIds.push(brand.id);
    const categories = await dataSource.getRepository(CategoryEntity).save(
      ['primary', 'secondary'].map((kind) =>
        dataSource.getRepository(CategoryEntity).create({
          tenantId: '1',
          categoryName: `${kind} ${suffix}`,
          slug: `${kind}-${suffix}`.slice(0, 191),
          description: null,
          parentCategoryId: null,
          categoryStatus: 'active',
          categoryVisibility: 'public',
        }),
      ),
    );
    created.categoryIds.push(...categories.map((item) => item.id));
    const media = await dataSource.getRepository(MediaAssetEntity).save(
      dataSource.getRepository(MediaAssetEntity).create({
        tenantId: '1',
        mediaName: `Media ${suffix}`,
        mediaType: 'image',
        mediaPurpose: 'product',
        storageReference: `https://cdn.example.test/${suffix}.webp`,
        mediaVisibility: 'public',
        mediaStatus: 'active',
      }),
    );
    created.mediaIds.push(media.id);
    return { brand, categories, media };
  }

  function aggregateInput(fixture: Awaited<ReturnType<typeof relations>>, label: string) {
    const normalized = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return {
      sku: `ADMIN-${normalized}`.slice(0, 64),
      name: `Admin Product ${label}`,
      slug: `admin-product-${normalized}`.slice(0, 191),
      price: '69000.00',
      brandId: fixture.brand.id,
      categoryIds: [fixture.categories[0].id],
      primaryCategoryId: fixture.categories[0].id,
      featured: false,
      content: {
        description: 'Nội dung Product published hợp lệ.',
        summary: 'Tóm tắt persisted.',
        usageNote: null,
        storageNote: null,
        seoTitle: null,
        seoDescription: null,
        status: 'published' as const,
      },
      nutrition: {
        servingSize: '250 ml',
        calories: '120 kcal',
        protein: '3 g',
        carbohydrates: '18 g',
        fat: '4 g',
        sugar: '6 g',
        note: null,
      },
      ingredients: [
        {
          name: 'Hạnh nhân',
          description: null,
          nutritionNote: null,
          allergyWarning: 'Có chứa hạt.',
        },
      ],
      dietaryTags: ['vegan' as const],
      media: [{ mediaAssetId: fixture.media.id, role: 'main' as const }],
    };
  }

  function context() {
    return { actorUserAccountId: '1', tenantId: '1' };
  }

  async function cleanup() {
    if (created.productIds.length) {
      const productIds = [...created.productIds];
      await dataSource.getRepository(ProductMediaLinkEntity).delete({ productId: In(productIds) });
      await dataSource.getRepository(ProductDietaryTagEntity).delete({ productId: In(productIds) });
      await dataSource.getRepository(ProductIngredientEntity).delete({ productId: In(productIds) });
      await dataSource
        .getRepository(ProductNutritionFactEntity)
        .delete({ productId: In(productIds) });
      await dataSource.getRepository(ProductContentEntity).delete({ productId: In(productIds) });
      await dataSource
        .getRepository(ProductCategoryLinkEntity)
        .delete({ productId: In(productIds) });
      await dataSource.getRepository(InventoryItemEntity).delete({ productId: In(productIds) });
      await dataSource.getRepository(ProductEntity).delete(productIds);
      created.productIds.splice(0);
    }
    if (created.mediaIds.length)
      await dataSource.getRepository(MediaAssetEntity).delete(created.mediaIds.splice(0));
    if (created.categoryIds.length)
      await dataSource.getRepository(CategoryEntity).delete(created.categoryIds.splice(0));
    if (created.brandIds.length)
      await dataSource.getRepository(BrandEntity).delete(created.brandIds.splice(0));
  }
});

type AdminProductDetailForTest = Awaited<ReturnType<TypeOrmAdminProductRepository['create']>>;
