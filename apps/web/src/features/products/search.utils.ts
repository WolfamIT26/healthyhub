import { catalogProducts, productBrands, productCategories } from './catalog.data';
import { dietaryTagLabels, type DietaryTag } from './product.types';

export type ProductSearchSuggestionType = 'query' | 'product' | 'category' | 'brand' | 'dietary';

export interface ProductSearchSuggestion {
  id: string;
  type: ProductSearchSuggestionType;
  label: string;
  meta: string;
  href: string;
  visual?: string;
  price?: string;
}

const moneyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
const dietaryEntries = Object.entries(dietaryTagLabels) as Array<[DietaryTag, string]>;

export function normalizeSearchQuery(value: string) {
  return value.trim().replace(/\s+/g, ' ').slice(0, 100);
}

export function getProductSearchSuggestions(rawQuery: string, limit = 8): ProductSearchSuggestion[] {
  const normalized = normalizeSearchQuery(rawQuery);
  const query = normalized.toLocaleLowerCase('vi-VN');
  if (!query) {
    return [
      ...productCategories.slice(0, 4).map((item) => ({ id: `category-${item.id}`, type: 'category' as const, label: item.name, meta: 'Danh mục gợi ý', href: `/products?category=${item.id}` })),
      ...dietaryEntries.slice(0, 3).map(([value, label]) => ({ id: `dietary-${value}`, type: 'dietary' as const, label, meta: 'Đặc điểm sản phẩm', href: `/products?dietary=${value}` })),
    ].slice(0, limit);
  }

  const suggestions: ProductSearchSuggestion[] = [{ id: `query-${query}`, type: 'query', label: normalized, meta: 'Tìm theo từ khóa', href: `/products?search=${encodeURIComponent(normalized)}` }];
  for (const category of productCategories) if (category.name.toLocaleLowerCase('vi-VN').includes(query)) suggestions.push({ id: `category-${category.id}`, type: 'category', label: category.name, meta: 'Danh mục', href: `/products?category=${category.id}` });
  for (const brand of productBrands) if (brand.name.toLocaleLowerCase('vi-VN').includes(query)) suggestions.push({ id: `brand-${brand.id}`, type: 'brand', label: brand.name, meta: 'Thương hiệu', href: `/products?brand=${brand.id}` });
  for (const [value, label] of dietaryEntries) if (label.toLocaleLowerCase('vi-VN').includes(query)) suggestions.push({ id: `dietary-${value}`, type: 'dietary', label, meta: 'Đặc điểm sản phẩm', href: `/products?dietary=${value}` });
  for (const product of catalogProducts) {
    const searchable = `${product.name} ${product.category.name} ${product.brand.name} ${product.shortDescription} ${product.dietaryTags.map((tag) => dietaryTagLabels[tag]).join(' ')}`.toLocaleLowerCase('vi-VN');
    if (searchable.includes(query)) suggestions.push({ id: `product-${product.id}`, type: 'product', label: product.name, meta: `${product.category.name} · ${product.brand.name}`, href: `/products/${product.slug}`, visual: product.visualFallback, price: moneyFormatter.format(product.price) });
  }
  return suggestions.filter((item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index).slice(0, limit);
}
