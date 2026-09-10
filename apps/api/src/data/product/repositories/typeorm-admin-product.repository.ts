import {
  ADMIN_PRODUCT_DIETARY_TAGS,
  type AdminCreateProductRequest,
  type AdminProductAggregateInput,
  type AdminProductAvailability,
  type AdminProductDetail,
  type AdminProductListItem,
  type AdminProductOptionsResult,
  type AdminProductStatusRequest,
  type AdminUpdateProductRequest,
} from '@healthyhub/shared-types';
import { Injectable } from '@nestjs/common';
import { DataSource, In, QueryFailedError, type EntityManager } from 'typeorm';

import { BrandEntity } from '../../brand/entities';
import { CategoryEntity, ProductCategoryLinkEntity } from '../../category/entities';
import { InventoryItemEntity } from '../../inventory/entities';
import { MediaAssetEntity } from '../../media/entities';
import {
  ProductContentEntity,
  ProductDietaryTagEntity,
  ProductEntity,
  ProductIngredientEntity,
  ProductMediaLinkEntity,
  ProductNutritionFactEntity,
} from '../entities';
import {
  AdminProductDataError,
  type AdminProductListQuery,
  type AdminProductRepository,
  type AdminProductWriteContext,
} from './admin-product.repository';

type RawListProduct = {
  productId: string;
  sku: string;
  productName: string;
  slug: string;
  price: string;
  productStatus: AdminProductListItem['productStatus'];
  visibility: AdminProductListItem['visibility'];
  sellableStatus: AdminProductListItem['sellableStatus'];
  featured: number | boolean;
  brandId: string | null;
  brandName: string | null;
  brandSlug: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  stockStatus: InventoryItemEntity['stockStatus'] | null;
  availableQuantity: string | number | null;
  updatedAt: Date | string;
  version: string | number;
};

@Injectable()
export class TypeOrmAdminProductRepository implements AdminProductRepository {
  constructor(private readonly dataSource: DataSource) {}

  async list(query: AdminProductListQuery, tenantId: string) {
    const builder = this.listQuery(tenantId);
    if (query.q) {
      builder.andWhere(
        `(product.product_name LIKE :q OR product.product_code LIKE :q OR product.slug LIKE :q OR EXISTS (
          SELECT 1 FROM product_contents searchContent
          WHERE searchContent.tenant_id = :tenantId AND searchContent.product_id = product.id
            AND searchContent.deleted_at IS NULL AND searchContent.summary LIKE :q
        ))`,
        { q: this.like(query.q) },
      );
    }
    if (query.productStatus)
      builder.andWhere('product.product_status = :productStatus', {
        productStatus: query.productStatus,
      });
    if (query.visibility)
      builder.andWhere('product.product_visibility = :visibility', {
        visibility: query.visibility,
      });
    if (query.categoryId)
      builder.andWhere(
        `EXISTS (SELECT 1 FROM product_category_links filterCategory
          WHERE filterCategory.tenant_id = :tenantId AND filterCategory.product_id = product.id
            AND filterCategory.category_id = :categoryId AND filterCategory.link_status = 'active'
            AND filterCategory.deleted_at IS NULL)`,
        { categoryId: query.categoryId },
      );
    if (query.brandId) builder.andWhere('product.brand_id = :brandId', { brandId: query.brandId });

    const totalRow = await builder.clone().select('COUNT(DISTINCT product.id)', 'total').getRawOne<{
      total: string;
    }>();
    this.applySort(builder, query.sort);
    const rows = await this.selectList(builder)
      .offset((query.page - 1) * query.pageSize)
      .limit(query.pageSize)
      .getRawMany<RawListProduct>();
    return { rows: rows.map((row) => this.mapList(row)), total: Number(totalRow?.total ?? 0) };
  }

  async detail(productId: string, tenantId: string): Promise<AdminProductDetail | null> {
    const product = await this.dataSource.getRepository(ProductEntity).findOne({
      where: { id: productId, tenantId },
    });
    if (!product) return null;
    const manager = this.dataSource.manager;
    const [brand, categories, contents, nutrition, ingredients, tags, media, inventory] =
      await Promise.all([
        product.brandId
          ? manager.getRepository(BrandEntity).findOneBy({ id: product.brandId, tenantId })
          : null,
        this.loadCategories(manager, product.id, tenantId),
        manager.getRepository(ProductContentEntity).find({
          where: { tenantId, productId: product.id },
          order: { updatedAt: 'DESC', id: 'DESC' },
        }),
        manager
          .getRepository(ProductNutritionFactEntity)
          .findOneBy({ tenantId, productId: product.id }),
        manager.getRepository(ProductIngredientEntity).find({
          where: { tenantId, productId: product.id },
          order: { displayOrder: 'ASC', id: 'ASC' },
        }),
        manager.getRepository(ProductDietaryTagEntity).find({
          where: { tenantId, productId: product.id },
          order: { dietaryTag: 'ASC' },
        }),
        this.loadMedia(manager, product.id, tenantId),
        manager.getRepository(InventoryItemEntity).findOneBy({ tenantId, productId: product.id }),
      ]);
    const content = contents[0];
    return {
      id: product.id,
      sku: product.productCode,
      name: product.productName,
      slug: product.slug,
      price: product.basePrice,
      productStatus: product.productStatus,
      visibility: product.productVisibility,
      sellableStatus: product.sellableStatus,
      availability: this.availability(product.sellableStatus, inventory),
      featured: product.isFeatured,
      brand: brand ? { id: brand.id, name: brand.brandName, slug: brand.brandSlug } : null,
      primaryCategory: categories.find((category) => category.primary) ?? null,
      categories,
      content: {
        description: content?.description ?? '',
        summary: content?.summary ?? null,
        usageNote: content?.usageNote ?? null,
        storageNote: content?.storageNote ?? null,
        seoTitle: content?.seoTitle ?? null,
        seoDescription: content?.seoDescription ?? null,
        status: content?.contentStatus ?? 'draft',
      },
      nutrition: nutrition
        ? {
            servingSize: nutrition.servingSize,
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbohydrates: nutrition.carbohydrates,
            fat: nutrition.fat,
            sugar: nutrition.sugar,
            note: nutrition.note,
          }
        : null,
      ingredients: ingredients.map((item) => ({
        name: item.ingredientName,
        description: item.ingredientDescription,
        nutritionNote: item.nutritionNote,
        allergyWarning: item.allergyWarning,
      })),
      dietaryTags: tags.map((item) => item.dietaryTag),
      media,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      version: product.version,
    };
  }

  async options(tenantId: string): Promise<AdminProductOptionsResult> {
    const [categories, brands, media] = await Promise.all([
      this.dataSource.getRepository(CategoryEntity).find({
        where: { tenantId, categoryStatus: 'active' },
        order: { categoryName: 'ASC' },
      }),
      this.dataSource.getRepository(BrandEntity).find({
        where: { tenantId, brandStatus: 'active' },
        order: { brandName: 'ASC' },
      }),
      this.dataSource.getRepository(MediaAssetEntity).find({
        where: { tenantId, mediaStatus: 'active', mediaType: 'image', mediaPurpose: 'product' },
        order: { mediaName: 'ASC' },
      }),
    ]);
    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.categoryName,
        slug: category.slug,
        visibility: category.categoryVisibility,
      })),
      brands: brands.map((brand) => ({
        id: brand.id,
        name: brand.brandName,
        slug: brand.brandSlug,
      })),
      dietaryTags: [...ADMIN_PRODUCT_DIETARY_TAGS],
      media: media.map((asset) => ({
        id: asset.id,
        name: asset.mediaName,
        visibility: asset.mediaVisibility,
        previewUrl: this.safePreview(asset.storageReference),
      })),
    };
  }

  async create(input: AdminCreateProductRequest, context: AdminProductWriteContext) {
    try {
      const productId = await this.dataSource.transaction(async (manager) => {
        await this.assertRelations(manager, input, context.tenantId);
        const products = manager.getRepository(ProductEntity);
        const product = await products.save(
          products.create({
            tenantId: context.tenantId,
            brandId: input.brandId,
            productCode: input.sku,
            productName: input.name,
            slug: input.slug,
            basePrice: input.price,
            sellableStatus: 'unavailable',
            productVisibility: 'hidden',
            productStatus: 'draft',
            isFeatured: input.featured,
            createdBy: context.actorUserAccountId,
            updatedBy: context.actorUserAccountId,
          }),
        );
        await this.reconcileAggregate(manager, product.id, input, context);
        return product.id;
      });
      return (await this.detail(productId, context.tenantId))!;
    } catch (error) {
      return this.rethrowWriteError(error);
    }
  }

  async update(
    productId: string,
    input: AdminUpdateProductRequest,
    context: AdminProductWriteContext,
  ) {
    try {
      await this.dataSource.transaction(async (manager) => {
        const product = await this.lockProduct(manager, productId, context.tenantId);
        this.assertVersion(product.version, input.version);
        await this.assertRelations(manager, input, context.tenantId);
        product.productName = input.name;
        product.slug = input.slug;
        product.basePrice = input.price;
        product.brandId = input.brandId;
        product.isFeatured = input.featured;
        product.updatedBy = context.actorUserAccountId;
        await manager.getRepository(ProductEntity).save(product);
        await this.reconcileAggregate(manager, product.id, input, context);
      });
      return (await this.detail(productId, context.tenantId))!;
    } catch (error) {
      return this.rethrowWriteError(error);
    }
  }

  async updateStatus(
    productId: string,
    input: AdminProductStatusRequest,
    context: AdminProductWriteContext,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const product = await this.lockProduct(manager, productId, context.tenantId);
      this.assertVersion(product.version, input.version);
      if (input.visibility === 'public' && input.productStatus !== 'active')
        throw new AdminProductDataError('PUBLICATION_REQUIREMENTS');
      if (input.visibility === 'public')
        await this.assertPublicationReady(manager, product.id, context.tenantId);
      product.productStatus = input.productStatus;
      product.productVisibility = input.visibility;
      product.updatedBy = context.actorUserAccountId;
      await manager.getRepository(ProductEntity).save(product);
    });
    return (await this.detail(productId, context.tenantId))!;
  }

  async softDelete(
    productId: string,
    version: number,
    context: AdminProductWriteContext,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const product = await this.lockProduct(manager, productId, context.tenantId);
      this.assertVersion(product.version, version);
      product.deletedBy = context.actorUserAccountId;
      product.updatedBy = context.actorUserAccountId;
      await manager.getRepository(ProductEntity).softRemove(product);
    });
  }

  private listQuery(tenantId: string) {
    return this.dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoin(
        ProductCategoryLinkEntity,
        'categoryLink',
        "categoryLink.product_id = product.id AND categoryLink.is_primary = 1 AND categoryLink.link_status = 'active' AND categoryLink.deleted_at IS NULL",
      )
      .leftJoin(CategoryEntity, 'category', 'category.id = categoryLink.category_id')
      .leftJoin(BrandEntity, 'brand', 'brand.id = product.brand_id')
      .leftJoin(
        InventoryItemEntity,
        'inventory',
        'inventory.product_id = product.id AND inventory.tenant_id = product.tenant_id AND inventory.deleted_at IS NULL',
      )
      .where('product.tenant_id = :tenantId', { tenantId })
      .andWhere('product.deleted_at IS NULL');
  }

  private selectList(builder: ReturnType<TypeOrmAdminProductRepository['listQuery']>) {
    return builder.select([
      'product.id AS productId',
      'product.product_code AS sku',
      'product.product_name AS productName',
      'product.slug AS slug',
      'product.base_price AS price',
      'product.product_status AS productStatus',
      'product.product_visibility AS visibility',
      'product.sellable_status AS sellableStatus',
      'product.is_featured AS featured',
      'product.updated_at AS updatedAt',
      'product.version AS version',
      'brand.id AS brandId',
      'brand.brand_name AS brandName',
      'brand.brand_slug AS brandSlug',
      'category.id AS categoryId',
      'category.category_name AS categoryName',
      'category.slug AS categorySlug',
      'inventory.stock_status AS stockStatus',
      'inventory.available_quantity AS availableQuantity',
    ]);
  }

  private applySort(
    builder: ReturnType<TypeOrmAdminProductRepository['listQuery']>,
    sort: AdminProductListQuery['sort'],
  ) {
    if (sort === 'updated-asc') builder.orderBy('product.updated_at', 'ASC');
    else if (sort === 'name-asc') builder.orderBy('product.product_name', 'ASC');
    else if (sort === 'name-desc') builder.orderBy('product.product_name', 'DESC');
    else if (sort === 'price-asc') builder.orderBy('product.base_price', 'ASC');
    else if (sort === 'price-desc') builder.orderBy('product.base_price', 'DESC');
    else builder.orderBy('product.updated_at', 'DESC');
    builder.addOrderBy('product.id', 'DESC');
  }

  private mapList(row: RawListProduct): AdminProductListItem {
    return {
      id: String(row.productId),
      sku: row.sku,
      name: row.productName,
      slug: row.slug,
      price: row.price,
      productStatus: row.productStatus,
      visibility: row.visibility,
      sellableStatus: row.sellableStatus,
      availability: this.availability(row.sellableStatus, {
        stockStatus: row.stockStatus,
        availableQuantity: row.availableQuantity === null ? null : Number(row.availableQuantity),
      }),
      featured: Boolean(Number(row.featured)),
      brand:
        row.brandId && row.brandName && row.brandSlug
          ? { id: String(row.brandId), name: row.brandName, slug: row.brandSlug }
          : null,
      primaryCategory:
        row.categoryId && row.categoryName && row.categorySlug
          ? { id: String(row.categoryId), name: row.categoryName, slug: row.categorySlug }
          : null,
      updatedAt: new Date(row.updatedAt).toISOString(),
      version: Number(row.version),
    };
  }

  private async loadCategories(manager: EntityManager, productId: string, tenantId: string) {
    const rows = await manager
      .getRepository(ProductCategoryLinkEntity)
      .createQueryBuilder('link')
      .innerJoin(CategoryEntity, 'category', 'category.id = link.category_id')
      .select([
        'category.id AS categoryId',
        'category.category_name AS categoryName',
        'category.slug AS categorySlug',
        'category.category_visibility AS categoryVisibility',
        'link.is_primary AS isPrimary',
      ])
      .where('link.tenant_id = :tenantId', { tenantId })
      .andWhere('link.product_id = :productId', { productId })
      .andWhere("link.link_status = 'active'")
      .andWhere('link.deleted_at IS NULL')
      .andWhere('category.deleted_at IS NULL')
      .orderBy('link.is_primary', 'DESC')
      .addOrderBy('category.category_name', 'ASC')
      .getRawMany<{
        categoryId: string;
        categoryName: string;
        categorySlug: string;
        categoryVisibility: 'public' | 'private';
        isPrimary: number | boolean;
      }>();
    return rows.map((row) => ({
      id: String(row.categoryId),
      name: row.categoryName,
      slug: row.categorySlug,
      visibility: row.categoryVisibility,
      primary: Boolean(Number(row.isPrimary)),
    }));
  }

  private async loadMedia(manager: EntityManager, productId: string, tenantId: string) {
    const rows = await manager
      .getRepository(ProductMediaLinkEntity)
      .createQueryBuilder('link')
      .innerJoin(MediaAssetEntity, 'media', 'media.id = link.media_asset_id')
      .select([
        'media.id AS mediaAssetId',
        'media.media_name AS mediaName',
        'media.media_visibility AS mediaVisibility',
        'media.storage_reference AS storageReference',
        'link.media_role AS mediaRole',
        'link.display_order AS displayOrder',
      ])
      .where('link.tenant_id = :tenantId', { tenantId })
      .andWhere('link.product_id = :productId', { productId })
      .andWhere("link.link_status = 'active'")
      .andWhere('link.deleted_at IS NULL')
      .andWhere('media.deleted_at IS NULL')
      .orderBy('link.display_order', 'ASC')
      .addOrderBy('link.id', 'ASC')
      .getRawMany<{
        mediaAssetId: string;
        mediaName: string;
        mediaVisibility: 'public' | 'private' | 'restricted';
        storageReference: string;
        mediaRole: 'main' | 'gallery' | 'nutrition';
        displayOrder: number | string;
      }>();
    return rows.map((row) => ({
      mediaAssetId: String(row.mediaAssetId),
      name: row.mediaName,
      role: row.mediaRole,
      displayOrder: Number(row.displayOrder),
      visibility: row.mediaVisibility,
      previewUrl: this.safePreview(row.storageReference),
    }));
  }

  private async assertRelations(
    manager: EntityManager,
    input: AdminProductAggregateInput,
    tenantId: string,
  ) {
    if (!input.categoryIds.includes(input.primaryCategoryId))
      throw new AdminProductDataError('INVALID_CATEGORY');
    const categories = await manager.getRepository(CategoryEntity).find({
      where: { tenantId, id: In(input.categoryIds), categoryStatus: 'active' },
    });
    if (categories.length !== input.categoryIds.length)
      throw new AdminProductDataError('INVALID_CATEGORY');
    if (input.brandId) {
      const brand = await manager
        .getRepository(BrandEntity)
        .findOneBy({ tenantId, id: input.brandId, brandStatus: 'active' });
      if (!brand) throw new AdminProductDataError('INVALID_BRAND');
    }
    const mediaIds = [...new Set(input.media.map((item) => item.mediaAssetId))];
    if (
      new Set(input.media.map((item) => `${item.mediaAssetId}:${item.role}`)).size !==
      input.media.length
    )
      throw new AdminProductDataError('INVALID_MEDIA');
    if (mediaIds.length) {
      const media = await manager.getRepository(MediaAssetEntity).find({
        where: {
          tenantId,
          id: In(mediaIds),
          mediaStatus: 'active',
          mediaType: 'image',
          mediaPurpose: 'product',
        },
      });
      if (media.length !== mediaIds.length) throw new AdminProductDataError('INVALID_MEDIA');
    }
  }

  private async reconcileAggregate(
    manager: EntityManager,
    productId: string,
    input: AdminProductAggregateInput,
    context: AdminProductWriteContext,
  ) {
    await this.reconcileCategories(manager, productId, input, context);
    await this.reconcileContent(manager, productId, input, context);
    await this.reconcileNutrition(manager, productId, input, context);
    await this.reconcileIngredients(manager, productId, input, context);
    await this.reconcileTags(manager, productId, input, context);
    await this.reconcileMedia(manager, productId, input, context);
  }

  private async reconcileCategories(
    manager: EntityManager,
    productId: string,
    input: AdminProductAggregateInput,
    context: AdminProductWriteContext,
  ) {
    const repository = manager.getRepository(ProductCategoryLinkEntity);
    const existing = await repository.find({
      where: { tenantId: context.tenantId, productId },
      withDeleted: true,
    });
    for (const row of existing) {
      row.linkStatus = 'inactive';
      row.isPrimary = false;
      row.updatedBy = context.actorUserAccountId;
    }
    if (existing.length) await repository.save(existing);
    const now = new Date();
    for (const categoryId of input.categoryIds) {
      const row =
        existing.find((candidate) => candidate.categoryId === categoryId) ??
        repository.create({
          tenantId: context.tenantId,
          productId,
          categoryId,
          linkedAt: now,
          createdBy: context.actorUserAccountId,
        });
      row.linkStatus = 'active';
      row.isPrimary = categoryId === input.primaryCategoryId;
      row.deletedAt = null;
      row.deletedBy = null;
      row.updatedBy = context.actorUserAccountId;
      await repository.save(row);
    }
  }

  private async reconcileContent(
    manager: EntityManager,
    productId: string,
    input: AdminProductAggregateInput,
    context: AdminProductWriteContext,
  ) {
    const repository = manager.getRepository(ProductContentEntity);
    const rows = await repository.find({
      where: { tenantId: context.tenantId, productId },
      withDeleted: true,
    });
    const target =
      rows.find((row) => row.contentStatus === input.content.status) ??
      repository.create({
        tenantId: context.tenantId,
        productId,
        contentStatus: input.content.status,
        createdBy: context.actorUserAccountId,
      });
    const now = new Date();
    for (const row of rows) {
      if (row === target) continue;
      row.deletedAt = now;
      row.deletedBy = context.actorUserAccountId;
      row.updatedBy = context.actorUserAccountId;
    }
    if (rows.length) await repository.save(rows);
    Object.assign(target, {
      description: input.content.description,
      summary: input.content.summary,
      usageNote: input.content.usageNote,
      storageNote: input.content.storageNote,
      seoTitle: input.content.seoTitle,
      seoDescription: input.content.seoDescription,
      contentStatus: input.content.status,
      deletedAt: null,
      deletedBy: null,
      updatedBy: context.actorUserAccountId,
    });
    await repository.save(target);
  }

  private async reconcileNutrition(
    manager: EntityManager,
    productId: string,
    input: AdminProductAggregateInput,
    context: AdminProductWriteContext,
  ) {
    const repository = manager.getRepository(ProductNutritionFactEntity);
    const row = await repository.findOne({
      where: { tenantId: context.tenantId, productId },
      withDeleted: true,
    });
    if (!input.nutrition) {
      if (row && !row.deletedAt) {
        row.deletedAt = new Date();
        row.deletedBy = context.actorUserAccountId;
        row.updatedBy = context.actorUserAccountId;
        await repository.save(row);
      }
      return;
    }
    const target =
      row ??
      repository.create({
        tenantId: context.tenantId,
        productId,
        createdBy: context.actorUserAccountId,
      });
    Object.assign(target, input.nutrition, {
      deletedAt: null,
      deletedBy: null,
      updatedBy: context.actorUserAccountId,
    });
    await repository.save(target);
  }

  private async reconcileIngredients(
    manager: EntityManager,
    productId: string,
    input: AdminProductAggregateInput,
    context: AdminProductWriteContext,
  ) {
    const repository = manager.getRepository(ProductIngredientEntity);
    const rows = await repository.find({
      where: { tenantId: context.tenantId, productId },
      withDeleted: true,
    });
    const desiredNames = new Set(input.ingredients.map((item) => item.name.toLocaleLowerCase()));
    const now = new Date();
    for (const row of rows) {
      if (desiredNames.has(row.ingredientName.toLocaleLowerCase())) continue;
      row.deletedAt = now;
      row.deletedBy = context.actorUserAccountId;
      row.updatedBy = context.actorUserAccountId;
    }
    if (rows.length) await repository.save(rows);
    for (const [displayOrder, item] of input.ingredients.entries()) {
      const row =
        rows.find(
          (candidate) =>
            candidate.ingredientName.toLocaleLowerCase() === item.name.toLocaleLowerCase(),
        ) ??
        repository.create({
          tenantId: context.tenantId,
          productId,
          createdBy: context.actorUserAccountId,
        });
      Object.assign(row, {
        ingredientName: item.name,
        ingredientDescription: item.description,
        nutritionNote: item.nutritionNote,
        allergyWarning: item.allergyWarning,
        displayOrder,
        deletedAt: null,
        deletedBy: null,
        updatedBy: context.actorUserAccountId,
      });
      await repository.save(row);
    }
  }

  private async reconcileTags(
    manager: EntityManager,
    productId: string,
    input: AdminProductAggregateInput,
    context: AdminProductWriteContext,
  ) {
    const repository = manager.getRepository(ProductDietaryTagEntity);
    const rows = await repository.find({
      where: { tenantId: context.tenantId, productId },
      withDeleted: true,
    });
    const desired = new Set(input.dietaryTags);
    const now = new Date();
    for (const row of rows) {
      if (desired.has(row.dietaryTag)) continue;
      row.deletedAt = now;
      row.deletedBy = context.actorUserAccountId;
      row.updatedBy = context.actorUserAccountId;
    }
    if (rows.length) await repository.save(rows);
    for (const dietaryTag of input.dietaryTags) {
      const row =
        rows.find((candidate) => candidate.dietaryTag === dietaryTag) ??
        repository.create({
          tenantId: context.tenantId,
          productId,
          dietaryTag,
          createdBy: context.actorUserAccountId,
        });
      row.deletedAt = null;
      row.deletedBy = null;
      row.updatedBy = context.actorUserAccountId;
      await repository.save(row);
    }
  }

  private async reconcileMedia(
    manager: EntityManager,
    productId: string,
    input: AdminProductAggregateInput,
    context: AdminProductWriteContext,
  ) {
    const repository = manager.getRepository(ProductMediaLinkEntity);
    const rows = await repository.find({
      where: { tenantId: context.tenantId, productId },
      withDeleted: true,
    });
    for (const row of rows) {
      row.linkStatus = 'inactive';
      row.updatedBy = context.actorUserAccountId;
    }
    if (rows.length) await repository.save(rows);
    for (const [displayOrder, item] of input.media.entries()) {
      const row =
        rows.find(
          (candidate) =>
            candidate.mediaAssetId === item.mediaAssetId && candidate.mediaRole === item.role,
        ) ??
        repository.create({
          tenantId: context.tenantId,
          productId,
          mediaAssetId: item.mediaAssetId,
          mediaRole: item.role,
          createdBy: context.actorUserAccountId,
        });
      Object.assign(row, {
        linkStatus: 'active',
        displayOrder,
        deletedAt: null,
        deletedBy: null,
        updatedBy: context.actorUserAccountId,
      });
      await repository.save(row);
    }
  }

  private async assertPublicationReady(
    manager: EntityManager,
    productId: string,
    tenantId: string,
  ) {
    const [primary, content] = await Promise.all([
      manager
        .getRepository(ProductCategoryLinkEntity)
        .createQueryBuilder('link')
        .innerJoin(CategoryEntity, 'category', 'category.id = link.category_id')
        .where('link.tenant_id = :tenantId', { tenantId })
        .andWhere('link.product_id = :productId', { productId })
        .andWhere('link.is_primary = 1')
        .andWhere("link.link_status = 'active'")
        .andWhere('link.deleted_at IS NULL')
        .andWhere("category.category_status = 'active'")
        .andWhere("category.category_visibility = 'public'")
        .andWhere('category.deleted_at IS NULL')
        .getExists(),
      manager.getRepository(ProductContentEntity).findOneBy({
        tenantId,
        productId,
        contentStatus: 'published',
      }),
    ]);
    if (!primary || !content?.description.trim())
      throw new AdminProductDataError('PUBLICATION_REQUIREMENTS');
  }

  private async lockProduct(manager: EntityManager, productId: string, tenantId: string) {
    const product = await manager.getRepository(ProductEntity).findOne({
      where: { id: productId, tenantId },
      lock: { mode: 'pessimistic_write' },
      withDeleted: true,
    });
    if (!product || product.deletedAt) throw new AdminProductDataError('NOT_FOUND');
    return product;
  }

  private assertVersion(current: number, expected: number) {
    if (current !== expected) throw new AdminProductDataError('VERSION_CONFLICT');
  }

  private rethrowWriteError(error: unknown): never {
    if (error instanceof AdminProductDataError) throw error;
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string } | undefined)?.code === 'ER_DUP_ENTRY'
    )
      throw new AdminProductDataError('DUPLICATE_IDENTITY');
    throw error;
  }

  private availability(
    sellableStatus: ProductEntity['sellableStatus'],
    inventory:
      | InventoryItemEntity
      | { stockStatus: InventoryItemEntity['stockStatus'] | null; availableQuantity: number | null }
      | null,
  ): AdminProductAvailability {
    if (sellableStatus === 'out_of_stock') return 'out_of_stock';
    if (sellableStatus !== 'sellable') return 'unavailable';
    if (!inventory || inventory.stockStatus === null || inventory.availableQuantity === null)
      return 'unavailable';
    if (inventory.stockStatus === 'disabled') return 'unavailable';
    if (inventory.stockStatus === 'out_of_stock' || inventory.availableQuantity === 0)
      return 'out_of_stock';
    if (inventory.stockStatus === 'low_stock') return 'low_stock';
    return 'in_stock';
  }

  private safePreview(storageReference: string) {
    return /^https?:\/\//i.test(storageReference) ? storageReference : null;
  }

  private like(value: string) {
    return `%${value.replace(/[\\%_]/g, '\\$&')}%`;
  }
}
