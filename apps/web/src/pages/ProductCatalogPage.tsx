import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  Badge,
  Breadcrumb,
  buttonClassName,
  Button,
  Card,
  Drawer,
  EmptyState,
  ErrorState,
  Pagination,
  ProductCard,
  Select,
  Skeleton,
} from '../components';
import {
  catalogQueryToParams,
  countActiveFilters,
  filterAndSortProducts,
  parseCatalogQuery,
} from '../features/products/catalog.utils';
import {
  productApi,
  type ProductListResult,
  type ProductOptions,
} from '../features/products/productApi';
import { ProductFilters } from '../features/products/ProductFilters';
import { ProductSearch } from '../features/products/ProductSearch';
import {
  dietaryTagLabels,
  stockStatusLabels,
  type CatalogQuery,
  type ProductPresentationModel,
} from '../features/products/product.types';
import { WishlistButton } from '../features/wishlist/WishlistButton';
import { AddToCartButton } from '../features/cart/AddToCartButton';

type CatalogStatus = 'loading' | 'success' | 'error';

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function ProductCatalogPage({
  products,
  status,
  onRetry,
}: {
  products?: ProductPresentationModel[];
  status?: CatalogStatus;
  onRetry?: () => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => parseCatalogQuery(searchParams), [searchParams]);
  const [searchDraft, setSearchDraft] = useState(query.search);
  const [filterOpen, setFilterOpen] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);
  const [apiStatus, setApiStatus] = useState<CatalogStatus>('loading');
  const [result, setResult] = useState<ProductListResult>({
    items: [],
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });
  const [options, setOptions] = useState<ProductOptions>({
    categories: [],
    brands: [],
    dietary: [],
  });
  const controlled = products !== undefined || status !== undefined;
  const effectiveOptions = useMemo<ProductOptions>(() => {
    if (!controlled) return options;
    const source = products ?? [];
    return {
      categories: Array.from(
        new Map(
          source.map((product) => [
            product.category.id,
            { ...product.category, slug: product.category.id },
          ]),
        ).values(),
      ),
      brands: Array.from(
        new Map(
          source.map((product) => [product.brand.id, { ...product.brand, slug: product.brand.id }]),
        ).values(),
      ),
      dietary: Array.from(new Set(source.flatMap((product) => product.dietaryTags))),
    };
  }, [controlled, options, products]);

  useEffect(() => setSearchDraft(query.search), [query.search]);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = query.search
      ? `Kết quả cho ${query.search} | HealthyHub`
      : 'Sản phẩm healthy | HealthyHub';
    return () => {
      document.title = previousTitle;
    };
  }, [query.search]);

  useEffect(() => {
    if (controlled) return;
    const controller = new AbortController();
    setApiStatus('loading');
    void Promise.all([
      productApi.list(query, controller.signal),
      productApi.options(controller.signal),
    ])
      .then(([nextResult, nextOptions]) => {
        setResult(nextResult);
        setOptions(nextOptions);
        setApiStatus('success');
      })
      .catch(() => {
        if (!controller.signal.aborted) setApiStatus('error');
      });
    return () => controller.abort();
  }, [controlled, query, requestVersion]);

  const filteredProducts = useMemo(
    () => (controlled ? filterAndSortProducts(products ?? [], query) : result.items),
    [controlled, products, query, result.items],
  );
  const totalPages = controlled
    ? Math.max(1, Math.ceil(filteredProducts.length / query.limit))
    : Math.max(1, result.totalPages);
  const currentPage = Math.min(query.page, totalPages);
  const pageItems = controlled
    ? filteredProducts.slice((currentPage - 1) * query.limit, currentPage * query.limit)
    : result.items;
  const totalItems = controlled ? filteredProducts.length : result.totalItems;
  const effectiveStatus = status ?? apiStatus;
  const activeFilterCount = countActiveFilters(query);

  function updateQuery(patch: Partial<CatalogQuery>, resetPage = true) {
    setSearchParams(
      catalogQueryToParams({
        ...query,
        ...patch,
        page: resetPage ? 1 : (patch.page ?? query.page),
      }),
    );
  }

  function clearFilters() {
    setSearchDraft('');
    setSearchParams(
      catalogQueryToParams({ ...parseCatalogQuery(new URLSearchParams()), limit: query.limit }),
    );
  }

  return (
    <main className="flex-1 bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white">
        <div className="container py-8 sm:py-10">
          <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sản phẩm' }]} />
          <div className="mt-5 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
              Danh mục HealthyHub
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
              Khám phá sản phẩm healthy
            </h1>
            <p className="mt-3 leading-7 text-neutral-600">
              Tìm kiếm và lọc trên Product Catalog được xác minh từ máy chủ HealthyHub.
            </p>
          </div>
          <ProductSearch
            className="mt-6 max-w-3xl"
            value={searchDraft}
            onValueChange={setSearchDraft}
            onSubmit={(search) => updateQuery({ search })}
            onClear={() => updateQuery({ search: '' })}
            label="Tìm kiếm trong danh mục sản phẩm"
            buttonLabel="Tìm sản phẩm"
          />
        </div>
      </div>

      <div className="container py-8 sm:py-10">
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div aria-live="polite">
            <p className="text-lg font-bold text-neutral-950">{totalItems} sản phẩm</p>
            {query.search ? (
              <p className="mt-1 text-sm text-neutral-600">Kết quả cho “{query.search}”</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Button
              type="button"
              variant="outline"
              className="lg:hidden"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen(true)}
            >
              Bộ lọc{activeFilterCount ? ` (${activeFilterCount})` : ''}
            </Button>
            <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
              Sắp xếp
              <Select
                aria-label="Sắp xếp sản phẩm"
                value={query.sort}
                onChange={(event) =>
                  updateQuery({ sort: event.target.value as CatalogQuery['sort'] })
                }
              >
                <option value="featured">Nổi bật</option>
                <option value="newest">Mới nhất</option>
                <option value="name-asc">Tên A → Z</option>
                <option value="name-desc">Tên Z → A</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
              Hiển thị
              <Select
                aria-label="Số sản phẩm mỗi trang"
                value={query.limit}
                onChange={(event) => updateQuery({ limit: Number(event.target.value) })}
              >
                {[12, 20, 40, 60].map((limit) => (
                  <option key={limit} value={limit}>
                    {limit} / trang
                  </option>
                ))}
              </Select>
            </label>
          </div>
        </div>

        {activeFilterCount || query.search ? (
          <ActiveFilters
            query={query}
            options={effectiveOptions}
            onChange={updateQuery}
            onClear={clearFilters}
          />
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block" aria-label="Bộ lọc sản phẩm">
            <Card className="sticky top-4">
              <h2 className="mb-5 text-lg font-bold text-neutral-950">
                Bộ lọc {activeFilterCount ? `(${activeFilterCount})` : ''}
              </h2>
              <ProductFilters
                query={query}
                options={effectiveOptions}
                onChange={updateQuery}
                onClear={clearFilters}
              />
            </Card>
          </aside>
          <section aria-labelledby="catalog-results-title" className="min-w-0">
            <h2 id="catalog-results-title" className="sr-only">
              Kết quả sản phẩm
            </h2>
            {effectiveStatus === 'loading' ? (
              <CatalogSkeleton />
            ) : effectiveStatus === 'error' ? (
              <ErrorState
                title="Không thể tải danh sách sản phẩm"
                description="Nguồn dữ liệu tạm thời chưa sẵn sàng. Bộ lọc hiện tại vẫn được giữ lại."
                action={
                  <Button
                    type="button"
                    onClick={() => {
                      onRetry?.();
                      setRequestVersion((value) => value + 1);
                    }}
                  >
                    Thử lại
                  </Button>
                }
              />
            ) : pageItems.length === 0 ? (
              <EmptyState
                title="Không tìm thấy sản phẩm"
                description="Hãy thử từ khóa khác hoặc xóa bớt bộ lọc đang áp dụng."
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button type="button" onClick={clearFilters}>
                      Xóa bộ lọc
                    </Button>
                    <Link to="/products" className={buttonClassName({ variant: 'outline' })}>
                      Xem tất cả sản phẩm
                    </Link>
                  </div>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {pageItems.map((product) => (
                    <CatalogProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 ? (
                  <div className="mt-10">
                    <Pagination
                      page={currentPage}
                      pageCount={totalPages}
                      onPageChange={(page) => updateQuery({ page }, false)}
                      label="Phân trang sản phẩm"
                    />
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>

      <Drawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title={`Bộ lọc sản phẩm${activeFilterCount ? ` (${activeFilterCount})` : ''}`}
        side="left"
      >
        <ProductFilters
          query={query}
          options={effectiveOptions}
          onChange={updateQuery}
          onClear={clearFilters}
          onApply={() => setFilterOpen(false)}
        />
      </Drawer>
    </main>
  );
}

function CatalogProductCard({ product }: { product: ProductPresentationModel }) {
  const badge = product.discountPercent
    ? `Giảm ${product.discountPercent}%`
    : product.featured
      ? 'Nổi bật'
      : undefined;
  return (
    <ProductCard
      name={product.name}
      category={`${product.category.name} · ${product.brand.name}`}
      price={moneyFormatter.format(product.price)}
      originalPrice={
        product.originalPrice ? moneyFormatter.format(product.originalPrice) : undefined
      }
      imageUrl={product.thumbnail ?? undefined}
      imageFallback={product.visualFallback}
      badge={
        badge ? (
          <Badge tone={product.discountPercent ? 'warning' : 'success'}>{badge}</Badge>
        ) : undefined
      }
      details={
        <>
          {product.rating !== undefined ? (
            <span aria-label={`${product.rating} trên 5 sao`}>★ {product.rating.toFixed(1)}</span>
          ) : null}
          {product.reviewCount !== undefined ? <span>({product.reviewCount} đánh giá)</span> : null}
          <span
            className={
              product.stockStatus === 'out_of_stock'
                ? 'font-semibold text-error-dark'
                : product.stockStatus === 'low_stock'
                  ? 'font-semibold text-warning-dark'
                  : 'font-semibold text-success-dark'
            }
          >
            {stockStatusLabels[product.stockStatus]}
          </span>
        </>
      }
      action={
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">
          <Link
            to={`/products/${product.slug}`}
            aria-label={`Xem chi tiết ${product.name}`}
            className={buttonClassName({ variant: 'outline', className: 'w-full' })}
          >
            Xem chi tiết
          </Link>
          <AddToCartButton
            compact
            productId={product.id}
            productName={product.name}
            disabled={!product.sellable}
          />
          <WishlistButton compact productId={product.id} productName={product.name} />
        </div>
      }
    />
  );
}

function ActiveFilters({
  query,
  options,
  onChange,
  onClear,
}: {
  query: CatalogQuery;
  options: ProductOptions;
  onChange(patch: Partial<CatalogQuery>): void;
  onClear(): void;
}) {
  const category = options.categories.find((item) => item.slug === query.category);
  const brand = options.brands.find((item) => item.slug === query.brand);
  const chips: Array<{ key: string; label: string; clear(): void }> = [];
  if (query.search)
    chips.push({
      key: 'search',
      label: `Tìm: ${query.search}`,
      clear: () => onChange({ search: '' }),
    });
  if (category)
    chips.push({ key: 'category', label: category.name, clear: () => onChange({ category: '' }) });
  if (brand) chips.push({ key: 'brand', label: brand.name, clear: () => onChange({ brand: '' }) });
  query.dietary.forEach((tag) =>
    chips.push({
      key: tag,
      label: dietaryTagLabels[tag],
      clear: () => onChange({ dietary: query.dietary.filter((item) => item !== tag) }),
    }),
  );
  if (query.minPrice !== undefined)
    chips.push({
      key: 'minPrice',
      label: `Từ ${moneyFormatter.format(query.minPrice)}`,
      clear: () => onChange({ minPrice: undefined }),
    });
  if (query.maxPrice !== undefined)
    chips.push({
      key: 'maxPrice',
      label: `Đến ${moneyFormatter.format(query.maxPrice)}`,
      clear: () => onChange({ maxPrice: undefined }),
    });
  if (query.availability)
    chips.push({
      key: 'availability',
      label: stockStatusLabels[query.availability],
      clear: () => onChange({ availability: '' }),
    });
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Bộ lọc đang áp dụng">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.clear}
          className="inline-flex min-h-9 items-center gap-2 rounded-full bg-primary-50 px-3 text-sm font-semibold text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {chip.label}
          <span aria-hidden="true">×</span>
          <span className="sr-only">Xóa bộ lọc {chip.label}</span>
        </button>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>
        Xóa tất cả
      </Button>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      aria-label="Đang tải sản phẩm"
      role="status"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={index} className="overflow-hidden p-0">
          <Skeleton className="aspect-square rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-11 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
