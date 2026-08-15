import type { ProductOptions } from './productApi';
import { dietaryTagLabels, type ProductPresentationModel } from './product.types';

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

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function normalizeSearchQuery(value: string) {
  return value.trim().replace(/\s+/g, ' ').slice(0, 100);
}

export function buildProductSearchSuggestions(
  rawQuery: string,
  products: ProductPresentationModel[],
  options: ProductOptions,
  limit = 8,
): ProductSearchSuggestion[] {
  const normalized = normalizeSearchQuery(rawQuery);
  const query = normalized.toLocaleLowerCase('vi-VN');
  if (!query)
    return [
      ...options.categories.slice(0, 4).map((item) => ({
        id: `category-${item.id}`,
        type: 'category' as const,
        label: item.name,
        meta: 'Danh mục gợi ý',
        href: `/products?category=${item.slug}`,
      })),
      ...options.dietary.slice(0, 3).map((value) => ({
        id: `dietary-${value}`,
        type: 'dietary' as const,
        label: dietaryTagLabels[value],
        meta: 'Đặc điểm sản phẩm',
        href: `/products?dietary=${value}`,
      })),
    ].slice(0, limit);

  const suggestions: ProductSearchSuggestion[] = [
    {
      id: `query-${query}`,
      type: 'query',
      label: normalized,
      meta: 'Tìm theo từ khóa',
      href: `/products?search=${encodeURIComponent(normalized)}`,
    },
  ];
  for (const category of options.categories)
    if (category.name.toLocaleLowerCase('vi-VN').includes(query))
      suggestions.push({
        id: `category-${category.id}`,
        type: 'category',
        label: category.name,
        meta: 'Danh mục',
        href: `/products?category=${category.slug}`,
      });
  for (const brand of options.brands)
    if (brand.name.toLocaleLowerCase('vi-VN').includes(query))
      suggestions.push({
        id: `brand-${brand.id}`,
        type: 'brand',
        label: brand.name,
        meta: 'Thương hiệu',
        href: `/products?brand=${brand.slug}`,
      });
  for (const dietary of options.dietary) {
    const label = dietaryTagLabels[dietary];
    if (label.toLocaleLowerCase('vi-VN').includes(query))
      suggestions.push({
        id: `dietary-${dietary}`,
        type: 'dietary',
        label,
        meta: 'Đặc điểm sản phẩm',
        href: `/products?dietary=${dietary}`,
      });
  }
  for (const product of products)
    suggestions.push({
      id: `product-${product.id}`,
      type: 'product',
      label: product.name,
      meta: `${product.category.name} · ${product.brand.name}`,
      href: `/products/${product.slug}`,
      visual: product.visualFallback,
      price: moneyFormatter.format(product.price),
    });
  return suggestions
    .filter(
      (item, index, items) =>
        items.findIndex((candidate) => candidate.href === item.href) === index,
    )
    .slice(0, limit);
}
