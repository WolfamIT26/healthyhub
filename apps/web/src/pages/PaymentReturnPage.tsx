import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Alert, Breadcrumb, buttonClassName, ErrorState, LoadingState } from '../components';
import { paymentApi } from '../features/payment/paymentApi';
import type { NormalizedApiError } from '../services/api/normalizeApiError';

export function PaymentReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function processReturn() {
      try {
        const summary = await paymentApi.processVnpayReturn(location.search);
        if (!active) return;
        navigate(`/payment/vnpay/result?paymentId=${summary.id}`, { replace: true });
      } catch (loadError) {
        if (active) setError(apiError(loadError));
      } finally {
        if (active) setLoading(false);
      }
    }

    void processReturn();
    return () => {
      active = false;
    };
  }, [location.search, navigate]);

  return (
    <PaymentShell>
      {error ? (
        <ErrorState
          title="Không thể xác minh thanh toán VNPAY"
          description={
            <span>
              {error.message}{' '}
              <Link className="font-semibold underline" to="/customer">
                Quay lại khu vực khách hàng
              </Link>
            </span>
          }
          action={
            <Link className={buttonClassName()} to="/customer">
              Về khu vực khách hàng
            </Link>
          }
        />
      ) : loading ? (
        <LoadingState label="Đang xác minh thanh toán VNPAY…" />
      ) : (
        <Alert tone="info" title="Đang xử lý">
          Hệ thống đang xác minh giao dịch VNPAY của bạn.
        </Alert>
      )}
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
            { label: 'VNPAY trả về' },
          ]}
        />
        <div className="mb-8 mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            Thanh toán
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Xác minh thanh toán
          </h1>
        </div>
        {children}
      </div>
    </main>
  );
}

function apiError(error: unknown): { message: string; code?: string } {
  const item = error as Partial<NormalizedApiError>;
  return {
    message: typeof item.message === 'string' ? item.message : 'Không thể kết nối máy chủ.',
    code: item.code,
  };
}
