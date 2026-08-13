import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  ErrorState,
  LoadingState,
  buttonClassName,
} from '../components';
import { paymentApi } from '../features/payment/paymentApi';
import type { PaymentSummary } from '../features/payment/payment.types';
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

export function PaymentResultPage() {
  const location = useLocation();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const refresh = useCallback(async () => {
    const nextPaymentId = new URLSearchParams(location.search).get('paymentId');
    setPaymentId(nextPaymentId);
    if (!nextPaymentId) {
      setPayment(null);
      setError({ message: 'Thiếu paymentId trên URL.' });
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const summary = await paymentApi.getStatus(nextPaymentId);
      setPayment(summary);
    } catch (loadError) {
      setPayment(null);
      setError(apiError(loadError));
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <PaymentShell>
      {loading ? (
        <LoadingState label="Đang tải trạng thái thanh toán…" />
      ) : error ? (
        <ErrorState
          title="Không thể tải trạng thái thanh toán"
          description={
            <span>
              {error.message}{' '}
              <Link className="font-semibold underline" to="/orders">
                Về đơn hàng của tôi
              </Link>
            </span>
          }
          action={
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  void refresh();
                }}
              >
                Thử lại
              </Button>
              <Link to="/orders" className={buttonClassName({ variant: 'secondary' })}>
                Về đơn hàng của tôi
              </Link>
            </div>
          }
        />
      ) : payment ? (
        <Card className="space-y-6">
          <Alert tone={toneForStatus(payment.status)} title={statusTitle(payment.status)}>
            {statusDescription(payment.status)}
          </Alert>
          <dl className="grid gap-4 sm:grid-cols-2">
            <PaymentMeta label="Payment ID" value={payment.id} />
            <PaymentMeta label="Order ID" value={payment.orderId} />
            <PaymentMeta
              label="Phương thức"
              value={payment.method === 'vnpay' ? 'VNPAY Sandbox' : 'COD'}
            />
            <PaymentMeta label="Số tiền" value={money.format(Number(payment.amount))} />
            <PaymentMeta label="Tham chiếu VNPAY" value={payment.providerReference ?? 'Chưa có'} />
            <PaymentMeta
              label="Cập nhật lúc"
              value={datetime.format(new Date(payment.updatedAt))}
            />
          </dl>
          <div className="flex flex-wrap gap-3">
            {payment.status === 'paid' ? (
              <Link to={`/orders/${payment.orderId}`} className={buttonClassName()}>
                Xem đơn hàng
              </Link>
            ) : (
              <Link to="/cart" className={buttonClassName()}>
                Quay lại giỏ hàng
              </Link>
            )}
            <Link to="/products" className={buttonClassName({ variant: 'secondary' })}>
              Tiếp tục mua sắm
            </Link>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                void refresh();
              }}
            >
              Tải lại
            </Button>
          </div>
          {paymentId ? (
            <p className="text-xs text-neutral-500">Tra cứu theo paymentId: {paymentId}</p>
          ) : null}
        </Card>
      ) : null}
    </PaymentShell>
  );
}

function PaymentShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 bg-neutral-50">
      <div className="container py-8 sm:py-10">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Thanh toán', href: '/checkout' },
            { label: 'Kết quả' },
          ]}
        />
        <div className="mb-8 mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            Thanh toán
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Trạng thái thanh toán
          </h1>
        </div>
        {children}
      </div>
    </main>
  );
}

function PaymentMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-neutral-200 bg-white p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </dt>
      <dd className="mt-2 break-all text-sm font-semibold text-neutral-950">{value}</dd>
    </div>
  );
}

function toneForStatus(status: PaymentSummary['status']) {
  if (status === 'paid') return 'success';
  if (status === 'failed') return 'error';
  if (status === 'cancelled') return 'warning';
  return 'info';
}

function statusTitle(status: PaymentSummary['status']) {
  if (status === 'paid') return 'Thanh toán thành công';
  if (status === 'failed') return 'Thanh toán thất bại';
  if (status === 'cancelled') return 'Thanh toán đã bị hủy';
  return 'Thanh toán đang xử lý';
}

function statusDescription(status: PaymentSummary['status']) {
  if (status === 'paid')
    return 'VNPAY đã xác nhận giao dịch. Đơn hàng đã được chuyển sang trạng thái phù hợp.';
  if (status === 'failed')
    return 'Giao dịch không thành công hoặc không thể xác minh với provider.';
  if (status === 'cancelled') return 'Người dùng đã hủy giao dịch trên cổng thanh toán.';
  return 'Giao dịch vẫn đang chờ xác minh hoặc đối soát với provider.';
}

function apiError(error: unknown): { message: string; code?: string } {
  const item = error as Partial<NormalizedApiError>;
  return {
    message: typeof item.message === 'string' ? item.message : 'Không thể kết nối máy chủ.',
    code: item.code,
  };
}
