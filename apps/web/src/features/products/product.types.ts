export type ProductStockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type DietaryTag = 'low-sugar' | 'sugar-free' | 'high-protein' | 'vegan' | 'vegetarian' | 'lactose-free' | 'gluten-free' | 'organic';

export interface ProductMediaPresentation {
  id: string;
  src: string | null;
  alt: string;
  label: string;
  visualFallback: string;
}

export interface ProductNutritionPresentation {
  servingSize?: string;
  calories?: string;
  protein?: string;
  carbohydrates?: string;
  fat?: string;
  sugar?: string;
  note?: string;
}

export interface ProductIngredientPresentation {
  name: string;
  description?: string;
}

export interface ProductPresentationModel {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  category: { id: string; name: string };
  brand: { id: string; name: string };
  images: ProductMediaPresentation[];
  thumbnail: string | null;
  visualFallback: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stockStatus: ProductStockStatus;
  featured: boolean;
  badges: string[];
  dietaryTags: DietaryTag[];
  nutrition?: ProductNutritionPresentation;
  ingredients: ProductIngredientPresentation[];
  allergenInformation?: string;
  storageNote?: string;
  usageNote?: string;
  longDescription?: string;
  createdAt: string;
}

export interface CatalogQuery {
  search: string;
  category: string;
  brand: string;
  dietary: DietaryTag[];
  minPrice?: number;
  maxPrice?: number;
  availability: '' | ProductStockStatus;
  sort: CatalogSort;
  page: number;
  limit: number;
}

export type CatalogSort = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'rating';

export const dietaryTagLabels: Record<DietaryTag, string> = {
  'low-sugar': 'Ít đường',
  'sugar-free': 'Không đường',
  'high-protein': 'Giàu protein',
  vegan: 'Thuần chay',
  vegetarian: 'Ăn chay',
  'lactose-free': 'Không lactose',
  'gluten-free': 'Không gluten',
  organic: 'Hữu cơ',
};

export const stockStatusLabels: Record<ProductStockStatus, string> = {
  in_stock: 'Còn hàng',
  low_stock: 'Sắp hết hàng',
  out_of_stock: 'Hết hàng',
};
