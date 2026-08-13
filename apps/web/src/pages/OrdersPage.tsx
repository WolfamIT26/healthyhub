import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { PaginationMetadata } from '@healthyhub/shared-types';

import {
  Breadcrumb,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Skeleton,
  StatusBadge,
  buttonClassName,
} from '../components';
import { orderApi } from '../features/orders/orderApi';
import {
  orderStatusLabel,
  orderStatusTone,
  paymentMethodLabel,
  paymentStatusLabel,
  paymentStatusTone,
} from '../features/orders/orderPresentation';
import type {
  CustomerOrderListItem,
  OrderStatus,
  PaymentStatus,
} from '../features/orders/order.types';
import type { NormalizedApiError } from '../services/api/normalizeApiError';

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});
const datetime = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const orderStatuses = new Set<OrderStatus>(['new', 'confirmed']);
const paymentStatuses = new Set<PaymentStatus>([
  'unpaid',
  'pending',
  'paid',
  'failed',
  'cancelled',
]);

export function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = positivePage(searchParams.get('page'));
  const orderStatus = enumValue(searchParams.get('orderStatus'), orderStatuses);
  const paymentStatus = enumValue(searchParams.get('paymentStatus'), paymentStatuses);
  const [orders, setOrders] = useState<CustomerOrderListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestSequence.current;
    setLoading(true);
    setError(null);
    try {
      const result = await orderApi.list({
        page,
        pageSize: 20,
        orderStatus,
        paymentStatus,
      });
      if (requestId === requestSequence.current) {
        setOrders(result.items);
        setPagination(result.pagination);
      }
    } catch (loadError) {
      if (requestId === requestSequence.current) {
        setOrders([]);
        setPagination(null);
        setError(errorMessage(loadError));
      }
    } finally {
      if (requestId === requestSequence.current) setLoading(false);
    }
  }, [orderStatus, page, paymentStatus]);

  useEffect(() => {
    void load();
    return () => {
      requestSequence.current += 1;
    };
  }, [load]);

  function updateFilter(name: 'orderStatus' | 'paymentStatus', value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    next.delete('page');
    setSearchParams(next);
  }

  function updatePage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete('page');
    else next.set('page', String(nextPage));
    setSearchParams(next);
  }

  const filtered = Boolean(orderStatus || paymentStatus);
  return (
    <main className="flex-1 bg-neutral-50">
      <div className="container py-8 sm:py-10">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đơn hàng của tôi' }]} />
        <div className="mb-6 mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
              Tài khoản
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Đơn hàng của tôi</h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Theo dõi trạng thái đơn, thanh toán và thông tin giao hàng đã lưu.
            </p>
          </div>
          {pagination ? (
            <p className="text-sm text-neutral-600">{pagination.totalItems} đơn hàng</p>
          ) : null}
        </div>

        <Card aria-label="Bộ lọc đơn hàng" className="mb-6 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <label className="grid gap-2 text-sm font-semibold text-neutral-800">
            Trạng thái đơn
            <select
              aria-label="Lọc theo trạng thái đơn"
              className="min-h-11 rounded-control border border-neutral-300 bg-white px-3 font-normal"
              value={orderStatus ?? ''}
              onChange={(event) => updateFilter('orderStatus', event.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="new">Đơn mới</option>
              <option value="confirmed">Đã xác nhận</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-neutral-800">
            Trạng thái thanh toán
            <select
              aria-label="Lọc theo trạng thái thanh toán"
              className="min-h-11 rounded-control border border-neutral-300 bg-white px-3 font-normal"
              value={paymentStatus ?? ''}
              onChange={(event) => updateFilter('paymentStatus', event.target.value)}
            >
              <option value="">Tất cả thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
              <option value="pending">Đang chờ thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="failed">Thanh toán thất bại</option>
              <option value="cancelled">Thanh toán đã hủy</option>
            </select>
          </label>
        </Card>

        {loading ? (
          <OrderListSkeleton />
        ) : error ? (
          <ErrorState
            title="Không thể tải danh sách đơn hàng"
            description={error}
            action={
              <Button
                onClick={() => {
                  void load();
                }}
              >
                Thử lại
              </Button>
            }
          />
        ) : orders.length === 0 ? (
          <EmptyState
            title={filtered ? 'Không có đơn phù hợp' : 'Bạn chưa có đơn hàng'}
            description={
              filtered
                ? 'Hãy thay đổi bộ lọc để xem các đơn hàng khác.'
                : 'Khám phá sản phẩm và đặt đơn đầu tiên của bạn.'
            }
            action={
              filtered ? (
                <Button variant="outline" onClick={() => setSearchParams(new URLSearchParams())}>
                  Xóa bộ lọc
                </Button>
              ) : (
                <Link to="/products" className={buttonClassName()}>
                  Khám phá sản phẩm
                </Link>
              )
            }
          />
        ) : (
          <div data-testid="order-list" aria-label="Danh sách đơn hàng" className="grid gap-4">
            {orders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}

        {!loading && !error && pagination && pagination.totalPages > 1 ? (
          <nav
            aria-label="Phân trang đơn hàng"
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              variant="ghost"
              disabled={!pagination.hasPreviousPage}
              onClick={() => updatePage(page - 1)}
            >
              Trang trước
            </Button>
            <span className="text-sm font-semibold text-neutral-700">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="ghost"
              disabled={!pagination.hasNextPage}
              onClick={() => updatePage(page + 1)}
            >
              Trang sau
            </Button>
          </nav>
        ) : null}
      </div>
    </main>
  );
}

function OrderCard({ order }: { order: CustomerOrderListItem }) {
  return (
    <Card className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={orderStatusTone(order.orderStatus)}>
            {orderStatusLabel(order.orderStatus)}
          </StatusBadge>
          <StatusBadge tone={paymentStatusTone(order.paymentStatus)}>
            {paymentStatusLabel(order.paymentStatus)}
          </StatusBadge>
        </div>
        <h2 className="mt-3 break-words text-lg font-bold text-neutral-950">
          <Link className="hover:text-primary-700 hover:underline" to={`/orders/${order.orderId}`}>
            {order.orderNumber}
          </Link>
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          {datetime.format(new Date(order.createdAt))} · {order.itemCount} sản phẩm
        </p>
        <p className="mt-1 text-sm text-neutral-600">{paymentMethodLabel(order.paymentMethod)}</p>
      </div>
      <div className="flex flex-col items-start gap-3 md:items-end">
        <p className="text-lg font-bold text-primary-700">{money.format(Number(order.total))}</p>
        <Link to={`/orders/${order.orderId}`} className={buttonClassName({ variant: 'outline' })}>
          Xem chi tiết
        </Link>
      </div>
    </Card>
  );
}

function OrderListSkeleton() {
  return (
    <div role="status" aria-label="Đang tải đơn hàng" className="grid gap-4">
      {[0, 1, 2].map((item) => (
        <Card key={item} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
          <div className="space-y-3">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-5 w-64 max-w-full" />
            <Skeleton className="h-4 w-52 max-w-full" />
          </div>
          <Skeleton className="h-11 w-full" />
        </Card>
      ))}
    </div>
  );
}

function positivePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function enumValue<T extends string>(value: string | null, allowed: ReadonlySet<T>): T | undefined {
  return value && allowed.has(value as T) ? (value as T) : undefined;
}

function errorMessage(error: unknown): string {
  const normalized = error as Partial<NormalizedApiError>;
  return typeof normalized.message === 'string'
    ? normalized.message
    : 'Không thể kết nối máy chủ. Vui lòng thử lại.';
}
