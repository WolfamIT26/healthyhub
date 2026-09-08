import type {
  AdminCreateProductRequest,
  AdminProductAggregateInput,
  AdminProductStatusRequest,
  AdminUpdateProductRequest,
} from '@healthyhub/shared-types';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import {
  ADMIN_PRODUCT_REPOSITORY,
  AdminProductDataError,
  type AdminProductRepository,
} from '../../data/product/repositories';
import {
  AdminCreateProductDto,
  AdminProductListQueryDto,
  AdminProductStatusDto,
  AdminUpdateProductDto,
} from './admin-product.dto';
import { AdminProductAuditService } from './admin-product-audit.service';
import { ProductException } from './product.exception';

const TENANT_ID = '1';

@Injectable()
export class AdminProductService {
  constructor(
    @Inject(ADMIN_PRODUCT_REPOSITORY)
    private readonly repository: AdminProductRepository,
    private readonly audit: AdminProductAuditService,
  ) {}

  async list(query: AdminProductListQueryDto) {
    const normalized = { ...query, q: query.q?.trim() || undefined };
    const result = await this.repository.list(normalized, TENANT_ID);
    return {
      items: result.rows,
      page: query.page,
      pageSize: query.pageSize,
      totalItems: result.total,
      totalPages: result.total === 0 ? 0 : Math.ceil(result.total / query.pageSize),
    };
  }

  async detail(productId: string) {
    this.assertProductId(productId);
    const product = await this.repository.detail(productId, TENANT_ID);
    if (!product) this.notFound();
    return product;
  }

  options() {
    return this.repository.options(TENANT_ID);
  }

  async create(auth: AuthenticatedRequestContext, dto: AdminCreateProductDto) {
    const input = this.normalize(dto) as AdminCreateProductRequest;
    input.sku = dto.sku.trim().toUpperCase();
    try {
      const product = await this.repository.create(input, this.context(auth));
      this.audit.emit('created', auth.userAccountId, product.id, product.version);
      return { product, created: true };
    } catch (error) {
      return this.mapDataError(error);
    }
  }

  async update(auth: AuthenticatedRequestContext, productId: string, dto: AdminUpdateProductDto) {
    this.assertProductId(productId);
    try {
      const product = await this.repository.update(
        productId,
        { ...this.normalize(dto), version: dto.version } as AdminUpdateProductRequest,
        this.context(auth),
      );
      this.audit.emit('updated', auth.userAccountId, product.id, product.version);
      return { product };
    } catch (error) {
      return this.mapDataError(error);
    }
  }

  async updateStatus(
    auth: AuthenticatedRequestContext,
    productId: string,
    dto: AdminProductStatusDto,
  ) {
    this.assertProductId(productId);
    try {
      const input: AdminProductStatusRequest = {
        productStatus: dto.productStatus,
        visibility: dto.visibility,
        version: dto.version,
      };
      const product = await this.repository.updateStatus(productId, input, this.context(auth));
      this.audit.emit('status_changed', auth.userAccountId, product.id, product.version);
      return { product };
    } catch (error) {
      return this.mapDataError(error);
    }
  }

  async delete(auth: AuthenticatedRequestContext, productId: string, version: number) {
    this.assertProductId(productId);
    try {
      await this.repository.softDelete(productId, version, this.context(auth));
      this.audit.emit('deleted', auth.userAccountId, productId, version);
      return { productId, deleted: true as const };
    } catch (error) {
      return this.mapDataError(error);
    }
  }

  private normalize(
    dto: AdminCreateProductDto | AdminUpdateProductDto,
  ): AdminProductAggregateInput {
    const ingredients = dto.ingredients.map((item) => ({
      name: item.name.trim(),
      description: this.optional(item.description),
      nutritionNote: this.optional(item.nutritionNote),
      allergyWarning: this.optional(item.allergyWarning),
    }));
    if (
      new Set(ingredients.map((item) => item.name.toLocaleLowerCase('vi-VN'))).size !==
      ingredients.length
    )
      this.invalid('Tên thành phần không được trùng lặp.');
    if (!dto.categoryIds.includes(dto.primaryCategoryId))
      this.invalid('Danh mục chính phải nằm trong danh sách danh mục đã chọn.');
    if (
      new Set(dto.media.map((item) => `${item.mediaAssetId}:${item.role}`)).size !==
      dto.media.length
    )
      this.invalid('Quan hệ Media và vai trò không được trùng lặp.');

    return {
      name: dto.name.trim(),
      slug: dto.slug.trim().toLowerCase(),
      price: dto.price,
      brandId: dto.brandId || null,
      categoryIds: [...dto.categoryIds],
      primaryCategoryId: dto.primaryCategoryId,
      featured: dto.featured,
      content: {
        description: dto.content.description.trim(),
        summary: this.optional(dto.content.summary),
        usageNote: this.optional(dto.content.usageNote),
        storageNote: this.optional(dto.content.storageNote),
        seoTitle: this.optional(dto.content.seoTitle),
        seoDescription: this.optional(dto.content.seoDescription),
        status: dto.content.status,
      },
      nutrition: dto.nutrition
        ? {
            servingSize: this.optional(dto.nutrition.servingSize),
            calories: this.optional(dto.nutrition.calories),
            protein: this.optional(dto.nutrition.protein),
            carbohydrates: this.optional(dto.nutrition.carbohydrates),
            fat: this.optional(dto.nutrition.fat),
            sugar: this.optional(dto.nutrition.sugar),
            note: this.optional(dto.nutrition.note),
          }
        : null,
      ingredients,
      dietaryTags: [...dto.dietaryTags],
      media: dto.media.map((item) => ({ ...item })),
    };
  }

  private context(auth: AuthenticatedRequestContext) {
    return { actorUserAccountId: auth.userAccountId, tenantId: TENANT_ID };
  }

  private optional(value: string | null | undefined) {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private assertProductId(productId: string) {
    if (!/^[1-9]\d*$/.test(productId))
      throw new ProductException(
        HttpStatus.BAD_REQUEST,
        'VALIDATION.PRODUCT.INVALID_IDENTIFIER',
        'Product ID không hợp lệ.',
      );
  }

  private mapDataError(error: unknown): never {
    if (!(error instanceof AdminProductDataError)) throw error;
    if (error.code === 'NOT_FOUND') return this.notFound();
    if (error.code === 'VERSION_CONFLICT')
      throw new ProductException(
        HttpStatus.CONFLICT,
        'CONFLICT.PRODUCT.VERSION_CONFLICT',
        'Sản phẩm đã được cập nhật bởi phiên khác. Vui lòng tải lại.',
      );
    if (error.code === 'DUPLICATE_IDENTITY')
      throw new ProductException(
        HttpStatus.CONFLICT,
        'CONFLICT.PRODUCT.SLUG_OR_SKU_EXISTS',
        'SKU hoặc slug đã được sử dụng.',
      );
    if (error.code === 'PUBLICATION_REQUIREMENTS')
      throw new ProductException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'BUSINESS.PRODUCT.PUBLICATION_REQUIREMENTS_NOT_MET',
        'Sản phẩm public cần nội dung published và một danh mục chính active/public.',
      );
    const messages = {
      INVALID_BRAND: 'Brand không tồn tại hoặc không còn active.',
      INVALID_CATEGORY: 'Category không tồn tại, khác tenant hoặc không còn active.',
      INVALID_MEDIA: 'Media không tồn tại, khác tenant hoặc không đủ điều kiện gắn Product.',
    } as const;
    throw new ProductException(
      HttpStatus.UNPROCESSABLE_ENTITY,
      `VALIDATION.PRODUCT.${error.code}`,
      messages[error.code],
    );
  }

  private invalid(message: string): never {
    throw new ProductException(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'VALIDATION.PRODUCT.INVALID_AGGREGATE',
      message,
    );
  }

  private notFound(): never {
    throw new ProductException(
      HttpStatus.NOT_FOUND,
      'NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND',
      'Không tìm thấy sản phẩm trong tenant hiện tại.',
    );
  }
}
