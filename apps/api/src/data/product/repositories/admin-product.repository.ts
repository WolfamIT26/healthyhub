import type {
  AdminCreateProductRequest,
  AdminProductDetail,
  AdminProductListItem,
  AdminProductOptionsResult,
  AdminProductStatusRequest,
  AdminUpdateProductRequest,
} from '@healthyhub/shared-types';

export interface AdminProductListQuery {
  page: number;
  pageSize: number;
  q?: string;
  productStatus?: AdminProductListItem['productStatus'];
  visibility?: AdminProductListItem['visibility'];
  categoryId?: string;
  brandId?: string;
  sort: 'updated-desc' | 'updated-asc' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
}

export interface AdminProductWriteContext {
  actorUserAccountId: string;
  tenantId: string;
}

export interface AdminProductRepository {
  list(
    query: AdminProductListQuery,
    tenantId: string,
  ): Promise<{ rows: AdminProductListItem[]; total: number }>;
  detail(productId: string, tenantId: string): Promise<AdminProductDetail | null>;
  options(tenantId: string): Promise<AdminProductOptionsResult>;
  create(
    input: AdminCreateProductRequest,
    context: AdminProductWriteContext,
  ): Promise<AdminProductDetail>;
  update(
    productId: string,
    input: AdminUpdateProductRequest,
    context: AdminProductWriteContext,
  ): Promise<AdminProductDetail>;
  updateStatus(
    productId: string,
    input: AdminProductStatusRequest,
    context: AdminProductWriteContext,
  ): Promise<AdminProductDetail>;
  softDelete(productId: string, version: number, context: AdminProductWriteContext): Promise<void>;
}

export type AdminProductDataErrorCode =
  | 'NOT_FOUND'
  | 'VERSION_CONFLICT'
  | 'DUPLICATE_IDENTITY'
  | 'INVALID_BRAND'
  | 'INVALID_CATEGORY'
  | 'INVALID_MEDIA'
  | 'PUBLICATION_REQUIREMENTS';

export class AdminProductDataError extends Error {
  constructor(readonly code: AdminProductDataErrorCode) {
    super(code);
  }
}

export const ADMIN_PRODUCT_REPOSITORY = Symbol('ADMIN_PRODUCT_REPOSITORY');
