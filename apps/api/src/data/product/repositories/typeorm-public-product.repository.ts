import { Injectable } from '@nestjs/common';
import { DataSource, type SelectQueryBuilder } from 'typeorm';

import { BrandEntity } from '../../brand/entities';
import {
  CategoryDisplayRuleEntity,
  CategoryEntity,
  ProductCategoryLinkEntity,
} from '../../category/entities';
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
import type {
  PublicCatalogRepository,
  PublicBrandRecord,
  PublicCategoryRecord,
  PublicProductBaseRecord,
  PublicProductDetails,
  PublicProductOptionsRecord,
  PublicProductQuery,
} from './public-product.repository';

type RawProduct = {
  productId: string;
  productCode: string;
  productName: string;
  slug: string;
  price: string;
  sellableStatus: PublicProductBaseRecord['sellableStatus'];
  featured: number | boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  summary: string | null;
  description: string | null;
  usageNote: string | null;
  storageNote: string | null;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  brandId: string | null;
  brandSlug: string | null;
  brandName: string | null;
  stockStatus: PublicProductBaseRecord['stockStatus'];
  availableQuantity: string | number | null;
};

@Injectable()
export class TypeOrmPublicProductRepository implements PublicCatalogRepository {
  constructor(private readonly dataSource: DataSource) {}

  async list(query: PublicProductQuery) {
    const base = this.baseQuery();
    this.applyFilters(base, query);
    const totalRow = await base.clone().select('COUNT(DISTINCT product.id)', 'total').getRawOne<{
      total: string;
    }>();
    this.applySort(base, query.sort);
    const rows = await this.select(base)
      .offset((query.page - 1) * query.pageSize)
      .limit(query.pageSize)
      .getRawMany<RawProduct>();
    return { rows: rows.map((row) => this.map(row)), total: Number(totalRow?.total ?? 0) };
  }

  async findPublic(identifier: string): Promise<PublicProductBaseRecord | null> {
    const query = this.select(this.baseQuery()).andWhere(
      /^(?:[1-9]\d*)$/.test(identifier) ? 'product.id = :identifier' : 'product.slug = :identifier',
      { identifier },
    );
    const row = await query.getRawOne<RawProduct>();
    return row ? this.map(row) : null;
  }

  async loadDetails(productIds: string[]): Promise<PublicProductDetails> {
    const tags = new Map<string, ProductDietaryTagEntity['dietaryTag'][]>();
    const ingredients: PublicProductDetails['ingredients'] = new Map();
    const nutrition: PublicProductDetails['nutrition'] = new Map();
    const media: PublicProductDetails['media'] = new Map();
    if (!productIds.length) return { tags, ingredients, nutrition, media };

    const tagRows = await this.dataSource.getRepository(ProductDietaryTagEntity).find({
      where: productIds.map((productId) => ({ tenantId: '1', productId })),
      order: { id: 'ASC' },
    });
    for (const row of tagRows)
      tags.set(row.productId, [...(tags.get(row.productId) ?? []), row.dietaryTag]);

    const ingredientRows = await this.dataSource.getRepository(ProductIngredientEntity).find({
      where: productIds.map((productId) => ({ tenantId: '1', productId })),
      order: { displayOrder: 'ASC', id: 'ASC' },
    });
    for (const row of ingredientRows)
      ingredients.set(row.productId, [
        ...(ingredients.get(row.productId) ?? []),
        {
          name: row.ingredientName,
          description: row.ingredientDescription,
          nutritionNote: row.nutritionNote,
          allergyWarning: row.allergyWarning,
        },
      ]);

    const nutritionRows = await this.dataSource.getRepository(ProductNutritionFactEntity).find({
      where: productIds.map((productId) => ({ tenantId: '1', productId })),
    });
    for (const row of nutritionRows)
      nutrition.set(row.productId, {
        servingSize: row.servingSize,
        calories: row.calories,
        protein: row.protein,
        carbohydrates: row.carbohydrates,
        fat: row.fat,
        sugar: row.sugar,
        note: row.note,
      });

    const mediaRows = await this.dataSource
      .getRepository(ProductMediaLinkEntity)
      .createQueryBuilder('link')
      .innerJoin(MediaAssetEntity, 'media', 'media.id = link.media_asset_id')
      .select([
        'link.product_id AS productId',
        'link.media_role AS role',
        'link.display_order AS displayOrder',
        'media.id AS mediaId',
        'media.media_name AS label',
        'media.storage_reference AS url',
      ])
      .where('link.tenant_id = :tenantId', { tenantId: '1' })
      .andWhere('link.product_id IN (:...productIds)', { productIds })
      .andWhere('link.link_status = :linkStatus', { linkStatus: 'active' })
      .andWhere('link.deleted_at IS NULL')
      .andWhere('media.media_visibility = :visibility', { visibility: 'public' })
      .andWhere('media.media_status = :mediaStatus', { mediaStatus: 'active' })
      .andWhere('media.media_type = :mediaType', { mediaType: 'image' })
      .andWhere('media.media_purpose = :mediaPurpose', { mediaPurpose: 'product' })
      .andWhere("media.storage_reference REGEXP '^https?://'")
      .andWhere('media.deleted_at IS NULL')
      .orderBy('link.display_order', 'ASC')
      .getRawMany<{
        productId: string;
        role: string;
        mediaId: string;
        label: string;
        url: string;
      }>();
    for (const row of mediaRows)
      media.set(row.productId, [
        ...(media.get(row.productId) ?? []),
        { id: row.mediaId, url: row.url, role: row.role, label: row.label },
      ]);
    return { tags, ingredients, nutrition, media };
  }

  async options(): Promise<PublicProductOptionsRecord> {
    const [categories, brands, dietaryRows] = await Promise.all([
      this.dataSource.getRepository(CategoryEntity).find({
        where: {
          tenantId: '1',
          categoryStatus: 'active',
          categoryVisibility: 'public',
        },
        order: { categoryName: 'ASC' },
      }),
      this.dataSource.getRepository(BrandEntity).find({
        where: { tenantId: '1', brandStatus: 'active' },
        order: { brandName: 'ASC' },
      }),
      this.dataSource
        .getRepository(ProductDietaryTagEntity)
        .createQueryBuilder('tag')
        .select('DISTINCT tag.dietary_tag', 'dietaryTag')
        .where('tag.tenant_id = :tenantId', { tenantId: '1' })
        .andWhere('tag.deleted_at IS NULL')
        .orderBy('tag.dietary_tag', 'ASC')
        .getRawMany<{ dietaryTag: ProductDietaryTagEntity['dietaryTag'] }>(),
    ]);
    return {
      categories: categories.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.categoryName,
      })),
      brands: brands.map((item) => ({ id: item.id, slug: item.brandSlug, name: item.brandName })),
      dietary: dietaryRows.map((item) => item.dietaryTag),
    };
  }

  async categories(input?: { page: number; pageSize: number; q?: string }) {
    const query = this.dataSource
      .getRepository(CategoryEntity)
      .createQueryBuilder('category')
      .leftJoin(
        CategoryEntity,
        'parent',
        "parent.id = category.parent_category_id AND parent.category_status = 'active' AND parent.category_visibility = 'public' AND parent.deleted_at IS NULL",
      )
      .leftJoin(
        CategoryDisplayRuleEntity,
        'displayRule',
        "displayRule.category_id = category.id AND displayRule.display_channel = 'web' AND displayRule.rule_status = 'active' AND displayRule.effective_from <= CURRENT_TIMESTAMP(3) AND (displayRule.effective_to IS NULL OR displayRule.effective_to > CURRENT_TIMESTAMP(3)) AND displayRule.deleted_at IS NULL",
      )
      .where('category.tenant_id = :tenantId', { tenantId: '1' })
      .andWhere("category.category_status = 'active'")
      .andWhere("category.category_visibility = 'public'")
      .andWhere('category.deleted_at IS NULL');
    if (input?.q)
      query.andWhere('(category.category_name LIKE :q OR category.slug LIKE :q)', {
        q: this.like(input.q),
      });
    const total = await query.clone().getCount();
    query
      .select([
        'category.id AS categoryId',
        'category.slug AS categorySlug',
        'category.category_name AS categoryName',
        'category.description AS categoryDescription',
        'COALESCE(displayRule.display_order, 0) AS displayOrder',
        'parent.id AS parentId',
        'parent.slug AS parentSlug',
        'parent.category_name AS parentName',
      ])
      .orderBy('COALESCE(displayRule.display_order, 0)', 'ASC')
      .addOrderBy('category.category_name', 'ASC')
      .addOrderBy('category.id', 'ASC');
    if (input) query.offset((input.page - 1) * input.pageSize).limit(input.pageSize);
    const rows = await query.getRawMany<{
      categoryId: string;
      categorySlug: string;
      categoryName: string;
      categoryDescription: string | null;
      displayOrder: string | number;
      parentId: string | null;
      parentSlug: string | null;
      parentName: string | null;
    }>();
    return {
      total,
      rows: rows.map((row): PublicCategoryRecord => ({
        id: String(row.categoryId),
        slug: row.categorySlug,
        name: row.categoryName,
        description: row.categoryDescription,
        displayOrder: Number(row.displayOrder),
        parent:
          row.parentId && row.parentSlug && row.parentName
            ? { id: String(row.parentId), slug: row.parentSlug, name: row.parentName }
            : null,
      })),
    };
  }

  async brands(input?: { page: number; pageSize: number; q?: string }) {
    const query = this.dataSource
      .getRepository(BrandEntity)
      .createQueryBuilder('brand')
      .where('brand.tenant_id = :tenantId', { tenantId: '1' })
      .andWhere("brand.brand_status = 'active'")
      .andWhere('brand.deleted_at IS NULL');
    if (input?.q)
      query.andWhere('(brand.brand_name LIKE :q OR brand.brand_slug LIKE :q)', {
        q: this.like(input.q),
      });
    const total = await query.clone().getCount();
    query
      .select([
        'brand.id AS brandId',
        'brand.brand_slug AS brandSlug',
        'brand.brand_name AS brandName',
        'brand.brand_origin AS brandOrigin',
        'brand.description AS brandDescription',
      ])
      .orderBy('brand.brand_name', 'ASC')
      .addOrderBy('brand.id', 'ASC');
    if (input) query.offset((input.page - 1) * input.pageSize).limit(input.pageSize);
    const rows = await query.getRawMany<{
      brandId: string;
      brandSlug: string;
      brandName: string;
      brandOrigin: string | null;
      brandDescription: string | null;
    }>();
    return {
      total,
      rows: rows.map((row): PublicBrandRecord => ({
        id: String(row.brandId),
        slug: row.brandSlug,
        name: row.brandName,
        origin: row.brandOrigin,
        description: row.brandDescription,
      })),
    };
  }

  private baseQuery() {
    return this.dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .innerJoin(
        ProductCategoryLinkEntity,
        'categoryLink',
        "categoryLink.product_id = product.id AND categoryLink.is_primary = 1 AND categoryLink.link_status = 'active' AND categoryLink.deleted_at IS NULL",
      )
      .innerJoin(
        CategoryEntity,
        'category',
        "category.id = categoryLink.category_id AND category.category_status = 'active' AND category.category_visibility = 'public' AND category.deleted_at IS NULL",
      )
      .leftJoin(
        BrandEntity,
        'brand',
        "brand.id = product.brand_id AND brand.brand_status = 'active' AND brand.deleted_at IS NULL",
      )
      .leftJoin(
        ProductContentEntity,
        'content',
        "content.product_id = product.id AND content.content_status = 'published' AND content.deleted_at IS NULL",
      )
      .leftJoin(
        InventoryItemEntity,
        'inventory',
        'inventory.product_id = product.id AND inventory.tenant_id = product.tenant_id AND inventory.deleted_at IS NULL',
      )
      .where('product.tenant_id = :tenantId', { tenantId: '1' })
      .andWhere("product.product_status = 'active'")
      .andWhere("product.product_visibility = 'public'")
      .andWhere('product.deleted_at IS NULL');
  }

  private select(query: SelectQueryBuilder<ProductEntity>) {
    return query.select([
      'product.id AS productId',
      'product.product_code AS productCode',
      'product.product_name AS productName',
      'product.slug AS slug',
      'product.base_price AS price',
      'product.sellable_status AS sellableStatus',
      'product.is_featured AS featured',
      'product.created_at AS createdAt',
      'product.updated_at AS updatedAt',
      'content.summary AS summary',
      'content.description AS description',
      'content.usage_note AS usageNote',
      'content.storage_note AS storageNote',
      'category.id AS categoryId',
      'category.slug AS categorySlug',
      'category.category_name AS categoryName',
      'brand.id AS brandId',
      'brand.brand_slug AS brandSlug',
      'brand.brand_name AS brandName',
      'inventory.stock_status AS stockStatus',
      'inventory.available_quantity AS availableQuantity',
    ]);
  }

  private applyFilters(query: SelectQueryBuilder<ProductEntity>, input: PublicProductQuery) {
    if (input.q) {
      const q = `%${input.q.replace(/[\\%_]/g, '\\$&')}%`;
      query.andWhere(
        `(product.product_name LIKE :q OR product.product_code LIKE :q OR product.slug LIKE :q OR content.summary LIKE :q OR EXISTS (
          SELECT 1 FROM product_ingredients searchIngredient
          WHERE searchIngredient.product_id = product.id AND searchIngredient.deleted_at IS NULL
            AND searchIngredient.ingredient_name LIKE :q
        ))`,
        { q },
      );
    }
    if (input.category)
      query.andWhere('(category.slug = :category OR category.id = :category)', {
        category: input.category,
      });
    if (input.brand)
      query.andWhere('(brand.brand_slug = :brand OR brand.id = :brand)', { brand: input.brand });
    if (input.minPrice !== undefined)
      query.andWhere('product.base_price >= :minPrice', { minPrice: input.minPrice });
    if (input.maxPrice !== undefined)
      query.andWhere('product.base_price <= :maxPrice', { maxPrice: input.maxPrice });
    if (input.availability === 'in_stock')
      query.andWhere(
        "inventory.stock_status = 'available' AND inventory.available_quantity > 0 AND product.sellable_status = 'sellable'",
      );
    if (input.availability === 'low_stock')
      query.andWhere(
        "inventory.stock_status = 'low_stock' AND inventory.available_quantity > 0 AND product.sellable_status = 'sellable'",
      );
    if (input.availability === 'out_of_stock')
      query.andWhere(
        "(inventory.stock_status = 'out_of_stock' OR inventory.available_quantity = 0 OR product.sellable_status = 'out_of_stock')",
      );
    if (input.dietary.length)
      query.andWhere(
        `product.id IN (
          SELECT filteredTag.product_id FROM product_dietary_tags filteredTag
          WHERE filteredTag.tenant_id = :tenantId AND filteredTag.deleted_at IS NULL
            AND filteredTag.dietary_tag IN (:...dietary)
          GROUP BY filteredTag.product_id
          HAVING COUNT(DISTINCT filteredTag.dietary_tag) = :dietaryCount
        )`,
        { dietary: input.dietary, dietaryCount: input.dietary.length },
      );
    if (input.excludeProductId)
      query.andWhere('product.id != :excludeProductId', {
        excludeProductId: input.excludeProductId,
      });
  }

  private like(value: string) {
    return `%${value.replace(/[\\%_]/g, '\\$&')}%`;
  }

  private applySort(query: SelectQueryBuilder<ProductEntity>, sort: PublicProductQuery['sort']) {
    if (sort === 'newest') query.orderBy('product.created_at', 'DESC');
    else if (sort === 'name-asc') query.orderBy('product.product_name', 'ASC');
    else if (sort === 'name-desc') query.orderBy('product.product_name', 'DESC');
    else if (sort === 'price-asc') query.orderBy('product.base_price', 'ASC');
    else if (sort === 'price-desc') query.orderBy('product.base_price', 'DESC');
    else query.orderBy('product.is_featured', 'DESC').addOrderBy('product.updated_at', 'DESC');
    query.addOrderBy('product.id', 'DESC');
  }

  private map(row: RawProduct): PublicProductBaseRecord {
    return {
      id: String(row.productId),
      productCode: row.productCode,
      name: row.productName,
      slug: row.slug,
      price: row.price,
      sellableStatus: row.sellableStatus,
      featured: Boolean(Number(row.featured)),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      summary: row.summary,
      description: row.description,
      usageNote: row.usageNote,
      storageNote: row.storageNote,
      category: { id: String(row.categoryId), slug: row.categorySlug, name: row.categoryName },
      brand:
        row.brandId && row.brandSlug && row.brandName
          ? { id: String(row.brandId), slug: row.brandSlug, name: row.brandName }
          : null,
      stockStatus: row.stockStatus,
      availableQuantity: row.availableQuantity === null ? null : Number(row.availableQuantity),
    };
  }
}
