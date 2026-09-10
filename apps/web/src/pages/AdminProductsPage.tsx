import type {
  AdminProductListItem,
  AdminProductListResult,
  AdminProductOptionsResult,
} from '@healthyhub/shared-types';
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  Alert,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Input,
  Pagination,
  Select,
  Skeleton,
} from '../components';
import { buttonClassName } from '../components/ui/Button';
import { adminApi } from '../features/admin/adminApi';
import { useAuth } from '../features/auth/AuthContext';

interface ProductsState {
  products: AdminProductListResult | null;
  options: AdminProductOptionsResult | null;
  loading: boolean;
  error: string | null;
}

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export function AdminProductsPage() {
  const auth = useAuth();
  const canManage = auth.hasPermission('products:manage');
  const [searchParams, setSearchParams] = useSearchParams();
  const queryKey = searchParams.toString();
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [reloadKey, setReloadKey] = useState(0);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProductListItem | null>(null);
  const [state, setState] = useState<ProductsState>({
    products: null,
    options: null,
    loading: true,
    error: null,
  });

  const query = useMemo(() => {
    const params = new URLSearchParams(queryKey);
    return {
      page: positive(params.get('page'), 1),
      pageSize: 20,
      q: params.get('q') || undefined,
      productStatus: enumValue(params.get('status'), ['draft', 'active', 'discontinued']),
      visibility: enumValue(params.get('visibility'), ['public', 'hidden', 'private']),
      categoryId: params.get('categoryId') || undefined,
      brandId: params.get('brandId') || undefined,
      sort:
        enumValue(params.get('sort'), [
          'updated-desc',
          'updated-asc',
          'name-asc',
          'name-desc',
          'price-asc',
          'price-desc',
        ]) ?? 'updated-desc',
    };
  }, [queryKey]);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setState((current) => ({ ...current, loading: true, error: null }));
      try {
        const [products, options] = await Promise.all([
          adminApi.products.list(query, signal),
          adminApi.products.options(signal),
        ]);
        setState({ products, options, loading: false, error: null });
      } catch (error) {
        if (!signal?.aborted)
          setState((current) => ({ ...current, loading: false, error: message(error) }));
      }
    },
    [query],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, reloadKey]);

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setFilter('q', search.trim());
  }

  async function toggleVisibility(product: AdminProductListItem) {
    setMutatingId(product.id);
    setMutationError(null);
    try {
      await adminApi.products.updateStatus(product.id, {
        productStatus: product.visibility === 'public' ? product.productStatus : 'active',
        visibility: product.visibility === 'public' ? 'hidden' : 'public',
        version: product.version,
      });
      setReloadKey((value) => value + 1);
    } catch (error) {
      setMutationError(message(error));
    } finally {
      setMutatingId(null);
    }
  }

  async function deleteProduct() {
    if (!deleteTarget) return;
    setMutatingId(deleteTarget.id);
    setMutationError(null);
    try {
      await adminApi.products.delete(deleteTarget.id, deleteTarget.version);
      setDeleteTarget(null);
      setReloadKey((value) => value + 1);
    } catch (error) {
      setMutationError(message(error));
    } finally {
      setMutatingId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
            Product authority
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Quản lý sản phẩm</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Quản lý catalog; số lượng tồn kho thuộc module Inventory riêng.
          </p>
        </div>
        {canManage ? (
          <Link to="/admin/products/new" className={buttonClassName()}>
            Tạo sản phẩm
          </Link>
        ) : null}
      </div>

      <Card className="mt-6">
        <form className="flex flex-col gap-3 lg:flex-row" onSubmit={submitSearch}>
          <Input
            type="search"
            aria-label="Tìm sản phẩm quản trị"
            placeholder="Tên, SKU, slug hoặc nội dung…"
            value={search}
            maxLength={100}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button type="submit" variant="secondary">
            Tìm kiếm
          </Button>
        </form>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <FilterSelect
            label="Trạng thái"
            value={searchParams.get('status') ?? ''}
            onChange={(value) => setFilter('status', value)}
            options={[
              ['', 'Tất cả trạng thái'],
              ['draft', 'Bản nháp'],
              ['active', 'Active'],
              ['discontinued', 'Ngừng kinh doanh'],
            ]}
          />
          <FilterSelect
            label="Hiển thị"
            value={searchParams.get('visibility') ?? ''}
            onChange={(value) => setFilter('visibility', value)}
            options={[
              ['', 'Tất cả hiển thị'],
              ['public', 'Public'],
              ['hidden', 'Hidden'],
              ['private', 'Private'],
            ]}
          />
          <FilterSelect
            label="Danh mục"
            value={searchParams.get('categoryId') ?? ''}
            onChange={(value) => setFilter('categoryId', value)}
            options={[
              ['', 'Tất cả danh mục'],
              ...(state.options?.categories.map(
                (item) => [item.id, item.name] as [string, string],
              ) ?? []),
            ]}
          />
          <FilterSelect
            label="Thương hiệu"
            value={searchParams.get('brandId') ?? ''}
            onChange={(value) => setFilter('brandId', value)}
            options={[
              ['', 'Tất cả thương hiệu'],
              ...(state.options?.brands.map((item) => [item.id, item.name] as [string, string]) ??
                []),
            ]}
          />
          <FilterSelect
            label="Sắp xếp"
            value={searchParams.get('sort') ?? 'updated-desc'}
            onChange={(value) => setFilter('sort', value)}
            options={[
              ['updated-desc', 'Mới cập nhật'],
              ['updated-asc', 'Cũ cập nhật'],
              ['name-asc', 'Tên A–Z'],
              ['name-desc', 'Tên Z–A'],
              ['price-asc', 'Giá tăng dần'],
              ['price-desc', 'Giá giảm dần'],
            ]}
          />
        </div>
      </Card>

      {mutationError ? (
        <Alert tone="error" className="mt-5" title="Không thể cập nhật sản phẩm">
          {mutationError}
        </Alert>
      ) : null}

      {state.loading && !state.products ? (
        <ProductsSkeleton />
      ) : state.error && !state.products ? (
        <div className="mt-6">
          <ErrorState
            title="Không tải được danh sách sản phẩm"
            description={state.error}
            action={<Button onClick={() => setReloadKey((value) => value + 1)}>Thử lại</Button>}
          />
        </div>
      ) : state.products?.items.length ? (
        <Card className="mt-6 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-5 py-3">Sản phẩm</th>
                  <th className="px-5 py-3">Danh mục / Brand</th>
                  <th className="px-5 py-3">Giá</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Khả dụng</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {state.products.items.map((product) => (
                  <tr key={product.id} className="align-top">
                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="font-bold text-neutral-950 hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-neutral-500">
                        {product.sku} · /{product.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-neutral-700">
                      <p>{product.primaryCategory?.name ?? 'Chưa có danh mục chính'}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {product.brand?.name ?? 'Không thương hiệu'}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold">
                      {money.format(Number(product.price))}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone={product.productStatus === 'active' ? 'success' : 'neutral'}>
                          {statusLabel(product.productStatus)}
                        </Badge>
                        <Badge tone={product.visibility === 'public' ? 'primary' : 'warning'}>
                          {product.visibility}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-5 py-4">{availabilityLabel(product.availability)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}`}
                          className={buttonClassName({ variant: 'outline', size: 'sm' })}
                        >
                          {canManage ? 'Sửa' : 'Xem'}
                        </Link>
                        {canManage ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              loading={mutatingId === product.id}
                              onClick={() => void toggleVisibility(product)}
                            >
                              {product.visibility === 'public' ? 'Ẩn' : 'Công khai'}
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => setDeleteTarget(product)}
                            >
                              Xóa
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {state.products.totalPages > 1 ? (
            <div className="border-t border-neutral-200 px-4 py-4">
              <Pagination
                page={state.products.page}
                pageCount={state.products.totalPages}
                label="Phân trang sản phẩm quản trị"
                onPageChange={(page) => setFilter('page', String(page))}
              />
            </div>
          ) : null}
        </Card>
      ) : state.products ? (
        <div className="mt-6">
          <EmptyState
            title="Không có sản phẩm phù hợp"
            description="Thử thay đổi từ khóa hoặc bộ lọc. Sản phẩm mới chỉ có thể tạo khi có quyền quản lý."
            action={
              canManage ? (
                <Link to="/admin/products/new" className={buttonClassName()}>
                  Tạo sản phẩm
                </Link>
              ) : undefined
            }
          />
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void deleteProduct()}
        title="Xóa mềm sản phẩm"
        description={`Sản phẩm “${deleteTarget?.name ?? ''}” sẽ biến mất khỏi Public Catalog. Order, Review và Inventory history không bị xóa.`}
        confirmLabel="Xóa sản phẩm"
        danger
        pending={Boolean(deleteTarget && mutatingId === deleteTarget.id)}
      />
    </main>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange(value: string): void;
}) {
  return (
    <label className="text-xs font-semibold text-neutral-600">
      {label}
      <Select
        className="mt-1"
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue || 'all'} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </Select>
    </label>
  );
}

function ProductsSkeleton() {
  return (
    <div className="mt-6 space-y-3" role="status" aria-label="Đang tải sản phẩm quản trị">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-20" />
      ))}
    </div>
  );
}

function statusLabel(status: AdminProductListItem['productStatus']) {
  return status === 'active' ? 'Active' : status === 'draft' ? 'Bản nháp' : 'Ngừng kinh doanh';
}

function availabilityLabel(status: AdminProductListItem['availability']) {
  return {
    in_stock: 'Còn hàng',
    low_stock: 'Sắp hết',
    out_of_stock: 'Hết hàng',
    unavailable: 'Không khả dụng',
  }[status];
}

function positive(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function enumValue<T extends string>(value: string | null, allowed: readonly T[]): T | undefined {
  return value && allowed.includes(value as T) ? (value as T) : undefined;
}

function message(error: unknown) {
  return error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
    ? error.message
    : 'Không thể kết nối máy chủ.';
}
