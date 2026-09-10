import type { ApiSuccessEnvelope } from './index';

export type AdminProductStatus = 'draft' | 'active' | 'discontinued';
export type AdminProductVisibility = 'public' | 'hidden' | 'private';
export type AdminProductSellableStatus = 'sellable' | 'out_of_stock' | 'preorder' | 'unavailable';
export type AdminProductContentStatus = 'draft' | 'review' | 'published';
export type AdminProductDietaryTag =
  | 'low-sugar'
  | 'sugar-free'
  | 'high-protein'
  | 'vegan'
  | 'vegetarian'
  | 'lactose-free'
  | 'gluten-free'
  | 'organic';
export const ADMIN_PRODUCT_DIETARY_TAGS: AdminProductDietaryTag[] = [
  'low-sugar',
  'sugar-free',
  'high-protein',
  'vegan',
  'vegetarian',
  'lactose-free',
  'gluten-free',
  'organic',
];
export type AdminProductMediaRole = 'main' | 'gallery' | 'nutrition';
export type AdminProductAvailability = 'in_stock' | 'low_stock' | 'out_of_stock' | 'unavailable';

export interface AdminProductRelationOption {
  id: string;
  name: string;
  slug: string;
}

export interface AdminProductListItem {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: string;
  productStatus: AdminProductStatus;
  visibility: AdminProductVisibility;
  sellableStatus: AdminProductSellableStatus;
  availability: AdminProductAvailability;
  featured: boolean;
  brand: AdminProductRelationOption | null;
  primaryCategory: AdminProductRelationOption | null;
  updatedAt: string;
  version: number;
}

export interface AdminProductListResult {
  items: AdminProductListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminProductContentInput {
  description: string;
  summary: string | null;
  usageNote: string | null;
  storageNote: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: AdminProductContentStatus;
}

export interface AdminProductNutritionInput {
  servingSize: string | null;
  calories: string | null;
  protein: string | null;
  carbohydrates: string | null;
  fat: string | null;
  sugar: string | null;
  note: string | null;
}

export interface AdminProductIngredientInput {
  name: string;
  description: string | null;
  nutritionNote: string | null;
  allergyWarning: string | null;
}

export interface AdminProductMediaInput {
  mediaAssetId: string;
  role: AdminProductMediaRole;
}

export interface AdminProductAggregateInput {
  name: string;
  slug: string;
  price: string;
  brandId: string | null;
  categoryIds: string[];
  primaryCategoryId: string;
  featured: boolean;
  content: AdminProductContentInput;
  nutrition: AdminProductNutritionInput | null;
  ingredients: AdminProductIngredientInput[];
  dietaryTags: AdminProductDietaryTag[];
  media: AdminProductMediaInput[];
}

export interface AdminCreateProductRequest extends AdminProductAggregateInput {
  sku: string;
}

export interface AdminUpdateProductRequest extends AdminProductAggregateInput {
  version: number;
}

export interface AdminProductStatusRequest {
  productStatus: AdminProductStatus;
  visibility: AdminProductVisibility;
  version: number;
}

export interface AdminProductCategory extends AdminProductRelationOption {
  primary: boolean;
  visibility: 'public' | 'private';
}

export interface AdminProductMediaRelation {
  mediaAssetId: string;
  name: string;
  role: AdminProductMediaRole;
  displayOrder: number;
  visibility: 'public' | 'private' | 'restricted';
  previewUrl: string | null;
}

export interface AdminProductDetail extends AdminProductListItem {
  categories: AdminProductCategory[];
  content: AdminProductContentInput;
  nutrition: AdminProductNutritionInput | null;
  ingredients: AdminProductIngredientInput[];
  dietaryTags: AdminProductDietaryTag[];
  media: AdminProductMediaRelation[];
  createdAt: string;
}

export interface AdminProductMediaOption {
  id: string;
  name: string;
  visibility: 'public' | 'private' | 'restricted';
  previewUrl: string | null;
}

export interface AdminProductOptionsResult {
  categories: Array<AdminProductRelationOption & { visibility: 'public' | 'private' }>;
  brands: AdminProductRelationOption[];
  dietaryTags: AdminProductDietaryTag[];
  media: AdminProductMediaOption[];
}

export interface AdminProductMutationResult {
  product: AdminProductDetail;
  created?: boolean;
}

export interface AdminProductDeleteResult {
  productId: string;
  deleted: true;
}

export type AdminProductListResponse = ApiSuccessEnvelope<AdminProductListResult>;
export type AdminProductDetailResponse = ApiSuccessEnvelope<AdminProductDetail>;
export type AdminProductOptionsResponse = ApiSuccessEnvelope<AdminProductOptionsResult>;
export type AdminProductMutationResponse = ApiSuccessEnvelope<AdminProductMutationResult>;
export type AdminProductDeleteResponse = ApiSuccessEnvelope<AdminProductDeleteResult>;
