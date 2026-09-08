import type {
  AdminCreateProductRequest,
  AdminDashboardResponse,
  AdminProductDeleteResponse,
  AdminProductDetailResponse,
  AdminProductListResponse,
  AdminProductMutationResponse,
  AdminProductOptionsResponse,
  AdminProductStatusRequest,
  AdminProductStatus,
  AdminProductVisibility,
  AdminUpdateProductRequest,
} from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';

export interface AdminProductListQuery {
  page: number;
  pageSize: number;
  q?: string;
  productStatus?: AdminProductStatus;
  visibility?: AdminProductVisibility;
  categoryId?: string;
  brandId?: string;
  sort?: 'updated-desc' | 'updated-asc' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
}

export const adminApi = {
  dashboard: (signal?: AbortSignal) =>
    httpClient
      .get<AdminDashboardResponse>('/admin/analytics/dashboard', { signal })
      .then((response) => response.data.data),
  products: {
    list: (query: AdminProductListQuery, signal?: AbortSignal) =>
      httpClient
        .get<AdminProductListResponse>('/admin/products', { params: query, signal })
        .then((response) => response.data.data),
    options: (signal?: AbortSignal) =>
      httpClient
        .get<AdminProductOptionsResponse>('/admin/products/options', { signal })
        .then((response) => response.data.data),
    detail: (productId: string, signal?: AbortSignal) =>
      httpClient
        .get<AdminProductDetailResponse>(`/admin/products/${productId}`, { signal })
        .then((response) => response.data.data),
    create: (payload: AdminCreateProductRequest) =>
      httpClient
        .post<AdminProductMutationResponse>('/admin/products', payload)
        .then((response) => response.data.data),
    update: (productId: string, payload: AdminUpdateProductRequest) =>
      httpClient
        .patch<AdminProductMutationResponse>(`/admin/products/${productId}`, payload)
        .then((response) => response.data.data),
    updateStatus: (productId: string, payload: AdminProductStatusRequest) =>
      httpClient
        .patch<AdminProductMutationResponse>(`/admin/products/${productId}/status`, payload)
        .then((response) => response.data.data),
    delete: (productId: string, version: number) =>
      httpClient
        .delete<AdminProductDeleteResponse>(`/admin/products/${productId}`, {
          params: { version },
        })
        .then((response) => response.data.data),
  },
};
