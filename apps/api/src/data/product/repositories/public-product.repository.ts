import type { ProductDietaryTag } from '../entities';

export type PublicProductSort =
  'featured' | 'newest' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
export type PublicAvailability = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface PublicProductQuery {
  page: number;
  pageSize: number;
  q?: string;
  category?: string;
  brand?: string;
  dietary: ProductDietaryTag[];
  minPrice?: number;
  maxPrice?: number;
  availability?: PublicAvailability;
  sort: PublicProductSort;
  excludeProductId?: string;
}

export interface PublicProductBaseRecord {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  price: string;
  sellableStatus: 'sellable' | 'out_of_stock' | 'preorder' | 'unavailable';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  summary: string | null;
  description: string | null;
  usageNote: string | null;
  storageNote: string | null;
  category: { id: string; slug: string; name: string };
  brand: { id: string; slug: string; name: string } | null;
  stockStatus: 'available' | 'low_stock' | 'out_of_stock' | 'disabled' | null;
  availableQuantity: number | null;
}

export interface PublicProductDetails {
  tags: Map<string, ProductDietaryTag[]>;
  ingredients: Map<
    string,
    Array<{
      name: string;
      description: string | null;
      nutritionNote: string | null;
      allergyWarning: string | null;
    }>
  >;
  nutrition: Map<
    string,
    {
      servingSize: string | null;
      calories: string | null;
      protein: string | null;
      carbohydrates: string | null;
      fat: string | null;
      sugar: string | null;
      note: string | null;
    }
  >;
  media: Map<string, Array<{ id: string; url: string; role: string; label: string }>>;
}

export interface PublicProductOptionsRecord {
  categories: Array<{ id: string; slug: string; name: string }>;
  brands: Array<{ id: string; slug: string; name: string }>;
  dietary: ProductDietaryTag[];
}

export interface PublicDirectoryQuery {
  page: number;
  pageSize: number;
  q?: string;
}

export interface PublicCategoryRecord {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  displayOrder: number;
  parent: { id: string; slug: string; name: string } | null;
}

export interface PublicBrandRecord {
  id: string;
  slug: string;
  name: string;
  origin: string | null;
  description: string | null;
}

export interface PublicCatalogRepository {
  list(query: PublicProductQuery): Promise<{ rows: PublicProductBaseRecord[]; total: number }>;
  findPublic(identifier: string): Promise<PublicProductBaseRecord | null>;
  loadDetails(productIds: string[]): Promise<PublicProductDetails>;
  options(): Promise<PublicProductOptionsRecord>;
  categories(
    query?: PublicDirectoryQuery,
  ): Promise<{ rows: PublicCategoryRecord[]; total: number }>;
  brands(query?: PublicDirectoryQuery): Promise<{ rows: PublicBrandRecord[]; total: number }>;
}

export const PUBLIC_CATALOG_REPOSITORY = Symbol('PUBLIC_CATALOG_REPOSITORY');
