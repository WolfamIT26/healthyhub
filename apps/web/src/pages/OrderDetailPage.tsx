import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  Breadcrumb,
  Button,
  Card,
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
  shippingStatusLabel,
} from '../features/orders/orderPresentation';
import type { CustomerOrderDetail } from '../features/orders/order.types';
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

export function OrderDetailPage() {
  const { orderId = '' } = useParams();
  const [order, setOrder] = useState<CustomerOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestSequence.current;
    if (!orderId) {
      setLoading(false);
      setOrder(null);
      setError('Không tìm thấy mã định danh đơn hàng trên URL.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await orderApi.detail(orderId);
      if (requestId === requestSequence.current) setOrder(result);
    } catch (loadError) {
      if (requestId === requestSequence.current) {
        setOrder(null);
        setError(errorMessage(loadError));
      }
    } finally {
      if (requestId === requestSequence.current) setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
    return () => {
      requestSequence.current += 1;
    };
  }, [load]);

  return (
    <main className="flex-1 bg-neutral-50">
      <div className="container py-8 sm:py-10">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Đơn hàng của tôi', href: '/orders' },
            { label: order?.orderNumber ?? 'Chi tiết đơn' },
          ]}
        />
        <div className="mb-6 mt-5">
          <Link className="text-sm font-semibold text-primary-700 hover:underline" to="/orders">
            ← Quay lại đơn hàng của tôi
          </Link>
          <h1 className="mt-3 break-words text-3xl font-bold tracking-tight sm:text-4xl">
            {order?.orderNumber ?? 'Chi tiết đơn hàng'}
          </h1>
        </div>

        {loading ? (
          <OrderDetailSkeleton />
        ) : error ? (
          <ErrorState
            title="Không thể tải chi tiết đơn hàng"
            description={error}
            action={
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    void load();
                  }}
                >
                  Thử lại
                </Button>
                <Link to="/orders" className={buttonClassName({ variant: 'outline' })}>
                  Về danh sách đơn
                </Link>
              </div>
            }
          />
        ) : order ? (
          <OrderDetailContent order={order} />
        ) : null}
      </div>
    </main>
  );
}

function OrderDetailContent({ order }: { order: CustomerOrderDetail }) {
  return (
    <div
      data-testid="order-detail-layout"
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start"
    >
      <div className="grid min-w-0 gap-6">
        <Card>
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={orderStatusTone(order.orderStatus)}>
              {orderStatusLabel(order.orderStatus)}
            </StatusBadge>
            <StatusBadge tone={paymentStatusTone(order.paymentStatus)}>
              {paymentStatusLabel(order.paymentStatus)}
            </StatusBadge>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Meta label="Mã đơn" value={order.orderNumber} />
            <Meta label="Ngày đặt" value={datetime.format(new Date(order.placedAt))} />
            <Meta label="Trạng thái đơn" value={orderStatusLabel(order.orderStatus)} />
            <Meta label="Trạng thái giao hàng" value={shippingStatusLabel(order.shippingStatus)} />
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Sản phẩm</h2>
          <div className="mt-4 divide-y divide-neutral-200">
            {order.items.map((item, index) => (
              <div
                key={`${item.productId ?? item.sku ?? item.productName}-${index}`}
                className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <h3 className="break-words font-semibold text-neutral-950">{item.productName}</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {item.sku ? `SKU: ${item.sku} · ` : ''}
                    {money.format(Number(item.unitPrice))} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-neutral-950">{money.format(Number(item.lineTotal))}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Thông tin giao hàng</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div className="text-sm leading-6 text-neutral-700">
              <p className="font-semibold text-neutral-950">
                {order.shippingAddress.recipientName}
              </p>
              <p>{order.shippingAddress.phone}</p>
              <p>{formatAddress(order.shippingAddress)}</p>
              {order.shippingAddress.note ? <p>Ghi chú: {order.shippingAddress.note}</p> : null}
            </div>
            <dl className="grid gap-3">
              <Meta label="Phương thức" value="Giao hàng tiêu chuẩn" />
              <Meta label="Trạng thái" value={shippingStatusLabel(order.shipping.status)} />
              {order.shipping.trackingReference ? (
                <Meta label="Mã vận đơn" value={order.shipping.trackingReference} />
              ) : null}
            </dl>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Thông tin thanh toán</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Meta label="Phương thức" value={paymentMethodLabel(order.payment.method)} />
            <Meta label="Trạng thái" value={paymentStatusLabel(order.payment.status)} />
            <Meta label="Số tiền" value={money.format(Number(order.payment.amount))} />
            <Meta label="Cập nhật lúc" value={datetime.format(new Date(order.payment.updatedAt))} />
            {order.payment.method === 'vnpay' && order.payment.providerReference ? (
              <Meta label="Tham chiếu VNPAY" value={order.payment.providerReference} />
            ) : null}
            {order.payment.paidAt ? (
              <Meta
                label="Thanh toán lúc"
                value={datetime.format(new Date(order.payment.paidAt))}
              />
            ) : null}
          </dl>
        </Card>
      </div>

      <Card className="lg:sticky lg:top-6">
        <h2 className="text-lg font-bold">Tổng thanh toán</h2>
        <dl className="mt-5 space-y-4 text-sm">
          <SummaryRow label="Tạm tính" value={money.format(Number(order.subtotal))} />
          <SummaryRow label="Phí giao hàng" value={money.format(Number(order.shippingFee))} />
          <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-4 text-base font-bold">
            <dt>Tổng cộng</dt>
            <dd className="text-primary-700">{money.format(Number(order.total))}</dd>
          </div>
        </dl>
        <Link to="/products" className={buttonClassName({ className: 'mt-6 w-full' })}>
          Tiếp tục mua sắm
        </Link>
      </Card>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-neutral-900">{value}</dd>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-neutral-600">{label}</dt>
      <dd className="font-semibold text-neutral-950">{value}</dd>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Đang tải chi tiết đơn hàng"
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <div className="grid gap-6">
        <Skeleton className="h-52" />
        <Skeleton className="h-72" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}

function formatAddress(address: CustomerOrderDetail['shippingAddress']): string {
  return [
    address.addressLine,
    address.ward,
    address.district,
    address.provinceCity,
    address.countryCode,
  ]
    .filter((part): part is string => Boolean(part))
    .join(', ');
}

function errorMessage(error: unknown): string {
  const normalized = error as Partial<NormalizedApiError>;
  return typeof normalized.message === 'string'
    ? normalized.message
    : 'Không thể kết nối máy chủ. Vui lòng thử lại.';
}
