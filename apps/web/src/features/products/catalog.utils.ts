import type { CatalogQuery, CatalogSort, DietaryTag, ProductPresentationModel, ProductStockStatus } from './product.types';
import { productBrands, productCategories } from './catalog.data';

const allowedSorts: CatalogSort[] = ['featured', 'newest', 'price-asc', 'price-desc', 'best-selling', 'rating'];
const allowedDietary: DietaryTag[] = ['low-sugar', 'sugar-free', 'high-protein', 'vegan', 'vegetarian', 'lactose-free', 'gluten-free', 'organic'];
const allowedStock: ProductStockStatus[] = ['in_stock', 'low_stock', 'out_of_stock'];
const allowedLimits = [12, 20, 40, 60];

function positiveNumber(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parseCatalogQuery(params: URLSearchParams): CatalogQuery {
  const page = Math.max(1, Math.floor(Number(params.get('page')) || 1));
  const requestedLimit = Math.floor(Number(params.get('limit')) || 20);
  const sort = params.get('sort') as CatalogSort | null;
  const availability = params.get('availability') as ProductStockStatus | null;
  const category = params.get('category') ?? params.get('categoryId') ?? '';
  const brand = params.get('brand') ?? '';
  return {
    search: (params.get('search') ?? params.get('q') ?? '').trim().slice(0, 100),
    category: productCategories.some((item) => item.id === category) ? category : '',
    brand: productBrands.some((item) => item.id === brand) ? brand : '',
    dietary: (params.get('dietary') ?? '').split(',').filter((value): value is DietaryTag => allowedDietary.includes(value as DietaryTag)),
    minPrice: positiveNumber(params.get('minPrice')),
    maxPrice: positiveNumber(params.get('maxPrice')),
    availability: availability && allowedStock.includes(availability) ? availability : '',
    sort: sort && allowedSorts.includes(sort) ? sort : 'featured',
    page,
    limit: allowedLimits.includes(requestedLimit) ? requestedLimit : 20,
  };
}

export function catalogQueryToParams(query: CatalogQuery) {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.category) params.set('category', query.category);
  if (query.brand) params.set('brand', query.brand);
  if (query.dietary.length) params.set('dietary', query.dietary.join(','));
  if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
  if (query.availability) params.set('availability', query.availability);
  if (query.sort !== 'featured') params.set('sort', query.sort);
  if (query.page !== 1) params.set('page', String(query.page));
  if (query.limit !== 20) params.set('limit', String(query.limit));
  return params;
}

export function filterAndSortProducts(products: ProductPresentationModel[], query: CatalogQuery) {
  const keyword = query.search.toLocaleLowerCase('vi-VN');
  const filtered = products.filter((product) => {
    const searchable = `${product.name} ${product.sku} ${product.slug} ${product.shortDescription} ${product.brand.name}`.toLocaleLowerCase('vi-VN');
    return (!keyword || searchable.includes(keyword))
      && (!query.category || product.category.id === query.category)
      && (!query.brand || product.brand.id === query.brand)
      && (!query.dietary.length || query.dietary.every((tag) => product.dietaryTags.includes(tag)))
      && (query.minPrice === undefined || product.price >= query.minPrice)
      && (query.maxPrice === undefined || product.price <= query.maxPrice)
      && (!query.availability || product.stockStatus === query.availability);
  });
  return [...filtered].sort((left, right) => {
    if (query.sort === 'newest') return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    if (query.sort === 'price-asc') return left.price - right.price;
    if (query.sort === 'price-desc') return right.price - left.price;
    if (query.sort === 'best-selling') return right.soldCount - left.soldCount;
    if (query.sort === 'rating') return right.rating - left.rating || right.reviewCount - left.reviewCount;
    return Number(right.featured) - Number(left.featured) || right.soldCount - left.soldCount;
  });
}

export function countActiveFilters(query: CatalogQuery) {
  return Number(Boolean(query.category)) + Number(Boolean(query.brand)) + query.dietary.length + Number(query.minPrice !== undefined) + Number(query.maxPrice !== undefined) + Number(Boolean(query.availability));
}
