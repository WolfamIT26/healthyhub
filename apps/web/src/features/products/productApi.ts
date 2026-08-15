import type { ApiSuccessEnvelope } from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';
import type {
  CatalogQuery,
  DietaryTag,
  ProductPresentationModel,
  ProductStockStatus,
} from './product.types';

export interface ProductFilterOption {
  id: string;
  slug: string;
  name: string;
}

export interface ProductOptions {
  categories: ProductFilterOption[];
  brands: ProductFilterOption[];
  dietary: DietaryTag[];
}

interface ServerProduct {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string | null;
  usageNote: string | null;
  storageNote: string | null;
  category: ProductFilterOption;
  brand: ProductFilterOption | null;
  price: string;
  currency: 'VND';
  availability: ProductStockStatus | 'unavailable';
  sellable: boolean;
  featured: boolean;
  dietaryTags: DietaryTag[];
  ingredients: Array<{ name: string; description: string | null; nutritionNote: string | null }>;
  allergenInformation: string[];
  nutrition: ProductPresentationModel['nutrition'] | null;
  media: Array<{ id: string; url: string; role: string; label: string }>;
  createdAt: string;
  updatedAt: string;
}

interface ServerProductList {
  items: ServerProduct[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface ServerProductDetail extends ServerProduct {
  relatedProducts: ServerProduct[];
}

export interface ProductListResult {
  items: ProductPresentationModel[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ProductDetailResult {
  product: ProductPresentationModel;
  relatedProducts: ProductPresentationModel[];
}

export const productApi = {
  list: (query: CatalogQuery, signal?: AbortSignal) =>
    httpClient
      .get<ApiSuccessEnvelope<ServerProductList>>('/public/products', {
        signal,
        params: {
          page: query.page,
          pageSize: query.limit,
          q: query.search || undefined,
          category: query.category || undefined,
          brand: query.brand || undefined,
          dietary: query.dietary.length ? query.dietary.join(',') : undefined,
          minPrice: query.minPrice,
          maxPrice: query.maxPrice,
          availability: query.availability || undefined,
          sort: query.sort,
        },
      })
      .then((response) => ({
        ...response.data.data,
        items: response.data.data.items.map(mapProduct),
      })),
  detail: (identifier: string, signal?: AbortSignal) =>
    httpClient
      .get<ApiSuccessEnvelope<ServerProductDetail>>(`/public/products/${identifier}`, { signal })
      .then((response): ProductDetailResult => ({
        product: mapProduct(response.data.data),
        relatedProducts: response.data.data.relatedProducts.map(mapProduct),
      })),
  options: (signal?: AbortSignal) =>
    httpClient
      .get<ApiSuccessEnvelope<ProductOptions>>('/public/products/options', { signal })
      .then((response) => response.data.data),
};

function mapProduct(product: ServerProduct): ProductPresentationModel {
  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    shortDescription: product.shortDescription,
    category: { id: product.category.slug, name: product.category.name },
    brand: product.brand
      ? { id: product.brand.slug, name: product.brand.name }
      : { id: 'unbranded', name: 'HealthyHub' },
    images: product.media.map((media) => ({
      id: media.id,
      src: media.url,
      alt: `${media.label} của ${product.name}`,
      label: media.label,
      visualFallback: '🥬',
    })),
    thumbnail: product.media[0]?.url ?? null,
    visualFallback: '🥬',
    price: Number(product.price),
    stockStatus: product.availability,
    sellable: product.sellable,
    featured: product.featured,
    badges: product.featured ? ['Nổi bật'] : [],
    dietaryTags: product.dietaryTags,
    nutrition: product.nutrition ?? undefined,
    ingredients: product.ingredients.map((ingredient) => ({
      name: ingredient.name,
      description: ingredient.description ?? undefined,
    })),
    allergenInformation: product.allergenInformation.join(' '),
    storageNote: product.storageNote ?? undefined,
    usageNote: product.usageNote ?? undefined,
    longDescription: product.description ?? product.shortDescription,
    createdAt: product.createdAt,
  };
}
