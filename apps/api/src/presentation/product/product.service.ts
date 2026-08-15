import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type {
  PublicProductBaseRecord,
  PublicProductDetails,
} from '../../data/product/repositories';
import {
  PUBLIC_CATALOG_REPOSITORY,
  type PublicCatalogRepository,
} from '../../data/product/repositories';
import type { PublicDirectoryQueryDto, PublicProductQueryDto } from './product.dto';
import { ProductException } from './product.exception';

export type PublicProductAvailability = 'in_stock' | 'low_stock' | 'out_of_stock' | 'unavailable';

export interface PublicProductReadModel {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string | null;
  usageNote: string | null;
  storageNote: string | null;
  category: { id: string; slug: string; name: string };
  brand: { id: string; slug: string; name: string } | null;
  price: string;
  currency: 'VND';
  availability: PublicProductAvailability;
  sellable: boolean;
  featured: boolean;
  dietaryTags: string[];
  ingredients: Array<{ name: string; description: string | null; nutritionNote: string | null }>;
  allergenInformation: string[];
  nutrition: PublicProductDetails['nutrition'] extends Map<string, infer T> ? T | null : never;
  media: Array<{ id: string; url: string; role: string; label: string }>;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ProductService {
  constructor(
    @Inject(PUBLIC_CATALOG_REPOSITORY) private readonly repository: PublicCatalogRepository,
  ) {}

  async list(query: PublicProductQueryDto) {
    this.validatePriceRange(query);
    const normalized = { ...query, q: query.q?.trim() || undefined };
    const result = await this.repository.list(normalized);
    const details = await this.repository.loadDetails(result.rows.map((row) => row.id));
    return {
      items: result.rows.map((row) => this.read(row, details, false)),
      page: query.page,
      pageSize: query.pageSize,
      totalItems: result.total,
      totalPages: result.total === 0 ? 0 : Math.ceil(result.total / query.pageSize),
    };
  }

  async detail(identifier: string) {
    this.validateIdentifier(identifier);
    const product = await this.repository.findPublic(identifier);
    if (!product) this.notFound();
    const details = await this.repository.loadDetails([product.id]);
    const related = await this.repository.list({
      page: 1,
      pageSize: 4,
      category: product.category.slug,
      dietary: [],
      sort: 'featured',
      excludeProductId: product.id,
    });
    const relatedDetails = await this.repository.loadDetails(related.rows.map((row) => row.id));
    return {
      ...this.read(product, details, true),
      relatedProducts: related.rows.map((row) => this.read(row, relatedDetails, false)),
    };
  }

  options() {
    return this.repository.options();
  }

  async categories(query: PublicDirectoryQueryDto) {
    const normalized = { ...query, q: query.q?.trim() || undefined };
    const result = await this.repository.categories(normalized);
    return {
      items: result.rows,
      page: query.page,
      pageSize: query.pageSize,
      totalItems: result.total,
      totalPages: result.total === 0 ? 0 : Math.ceil(result.total / query.pageSize),
    };
  }

  async categoryTree() {
    const rows = (await this.repository.categories()).rows;
    type CategoryTreeNode = (typeof rows)[number] & { children: CategoryTreeNode[] };
    const nodes = new Map<string, CategoryTreeNode>(
      rows.map((row) => [row.id, { ...row, children: [] }]),
    );
    const roots: CategoryTreeNode[] = [];
    for (const node of nodes.values()) {
      const parent = node.parent ? nodes.get(node.parent.id) : undefined;
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
    return roots;
  }

  async category(identifier: string) {
    this.validateIdentifier(identifier);
    const item = (await this.repository.categories()).rows.find(
      (candidate) => candidate.id === identifier || candidate.slug === identifier,
    );
    if (!item)
      throw new ProductException(
        HttpStatus.NOT_FOUND,
        'NOT_FOUND.CATEGORY.CATEGORY_NOT_FOUND',
        'Không tìm thấy danh mục public.',
      );
    return item;
  }

  async brands(query: PublicDirectoryQueryDto) {
    const normalized = { ...query, q: query.q?.trim() || undefined };
    const result = await this.repository.brands(normalized);
    return {
      items: result.rows,
      page: query.page,
      pageSize: query.pageSize,
      totalItems: result.total,
      totalPages: result.total === 0 ? 0 : Math.ceil(result.total / query.pageSize),
    };
  }

  async brand(identifier: string) {
    this.validateIdentifier(identifier);
    const item = (await this.repository.brands()).rows.find(
      (candidate) => candidate.id === identifier || candidate.slug === identifier,
    );
    if (!item)
      throw new ProductException(
        HttpStatus.NOT_FOUND,
        'NOT_FOUND.BRAND.BRAND_NOT_FOUND',
        'Không tìm thấy thương hiệu public.',
      );
    return item;
  }

  private read(
    product: PublicProductBaseRecord,
    details: PublicProductDetails,
    includeDetail: boolean,
  ): PublicProductReadModel {
    const ingredients = details.ingredients.get(product.id) ?? [];
    const availability = this.availability(product);
    return {
      id: product.id,
      slug: product.slug,
      sku: product.productCode,
      name: product.name,
      shortDescription: product.summary ?? product.name,
      description: includeDetail ? product.description : null,
      usageNote: includeDetail ? product.usageNote : null,
      storageNote: includeDetail ? product.storageNote : null,
      category: product.category,
      brand: product.brand,
      price: product.price,
      currency: 'VND',
      availability,
      sellable:
        product.sellableStatus === 'sellable' &&
        availability !== 'unavailable' &&
        availability !== 'out_of_stock',
      featured: product.featured,
      dietaryTags: details.tags.get(product.id) ?? [],
      ingredients: includeDetail
        ? ingredients.map(({ name, description, nutritionNote }) => ({
            name,
            description,
            nutritionNote,
          }))
        : [],
      allergenInformation: includeDetail
        ? Array.from(
            new Set(
              ingredients
                .map((ingredient) => ingredient.allergyWarning)
                .filter((warning): warning is string => Boolean(warning)),
            ),
          )
        : [],
      nutrition: includeDetail ? (details.nutrition.get(product.id) ?? null) : null,
      media: details.media.get(product.id) ?? [],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  private availability(product: PublicProductBaseRecord): PublicProductAvailability {
    if (product.sellableStatus === 'out_of_stock' || product.stockStatus === 'out_of_stock')
      return 'out_of_stock';
    if (
      product.sellableStatus !== 'sellable' ||
      !product.stockStatus ||
      product.stockStatus === 'disabled'
    )
      return 'unavailable';
    return product.stockStatus === 'low_stock' ? 'low_stock' : 'in_stock';
  }

  private validatePriceRange(query: PublicProductQueryDto) {
    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    )
      throw new ProductException(
        HttpStatus.BAD_REQUEST,
        'VALIDATION.PRODUCT.INVALID_PRICE_RANGE',
        'Giá tối thiểu không được lớn hơn giá tối đa.',
      );
  }

  private validateIdentifier(identifier: string) {
    if (!/^(?:[1-9]\d*|[a-z0-9]+(?:-[a-z0-9]+)*)$/.test(identifier))
      throw new ProductException(
        HttpStatus.BAD_REQUEST,
        'VALIDATION.PRODUCT.INVALID_IDENTIFIER',
        'Mã hoặc slug Product không hợp lệ.',
      );
  }

  private notFound(): never {
    throw new ProductException(
      HttpStatus.NOT_FOUND,
      'NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND',
      'Không tìm thấy sản phẩm public.',
    );
  }
}
