import type { AdminDashboardResult } from '@healthyhub/shared-types';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Card, EmptyState, ErrorState, Skeleton, StatCard } from '../components';
import { Button, buttonClassName } from '../components/ui/Button';
import { adminApi } from '../features/admin/adminApi';
import type { NormalizedApiError } from '../services/api/normalizeApiError';

type DashboardState =
  | { status: 'loading' }
  | { status: 'error'; error: NormalizedApiError }
  | { status: 'ready'; dashboard: AdminDashboardResult };

const orderLabels: Record<keyof AdminDashboardResult['orders']['byStatus'], string> = {
  new: 'Mới',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
  returned: 'Đã hoàn trả',
};

const numberFormat = new Intl.NumberFormat('vi-VN');

export function AdminHomePage() {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<DashboardState>({ status: 'loading' });

  const retry = useCallback(() => setReloadKey((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    void adminApi
      .dashboard(controller.signal)
      .then((dashboard) => setState({ status: 'ready', dashboard }))
      .catch((error: NormalizedApiError) => {
        if (!controller.signal.aborted) setState({ status: 'error', error });
      });
    return () => controller.abort();
  }, [reloadKey]);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
            Tổng quan vận hành
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
            Dashboard quản trị
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
            Số liệu trực tiếp từ Product, Inventory, Order và Review persistence hiện tại.
          </p>
        </div>
        {state.status === 'ready' ? (
          <p className="text-xs text-neutral-500">
            Cập nhật lúc {new Date(state.dashboard.generatedAt).toLocaleString('vi-VN')}
          </p>
        ) : null}
      </div>

      {state.status === 'loading' ? <DashboardSkeleton /> : null}
      {state.status === 'error' ? (
        state.error.statusCode === 403 ? (
          <ErrorState
            title="Không đủ quyền xem dashboard"
            description="Phiên hiện tại không có quyền analytics:read. Dữ liệu quản trị vẫn được backend bảo vệ."
            action={
              <Link to="/" className={buttonClassName({ variant: 'outline' })}>
                Về cửa hàng
              </Link>
            }
          />
        ) : (
          <ErrorState
            title="Không tải được dashboard"
            description={state.error.message}
            action={<Button onClick={retry}>Thử lại</Button>}
          />
        )
      ) : null}
      {state.status === 'ready' ? <DashboardContent dashboard={state.dashboard} /> : null}
    </main>
  );
}

function DashboardContent({ dashboard }: { dashboard: AdminDashboardResult }) {
  const noData =
    dashboard.products.total === 0 && dashboard.orders.total === 0 && dashboard.reviews.total === 0;

  return (
    <div className="space-y-6">
      <section aria-label="Chỉ số vận hành" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Tổng sản phẩm"
          value={dashboard.products.total}
          detail="Tất cả Product chưa xóa"
          accent="bg-info"
        />
        <MetricCard
          label="Đang công khai"
          value={dashboard.products.activePublic}
          detail="Active và public"
          accent="bg-success"
        />
        <MetricCard
          label="Không sẵn sàng"
          value={dashboard.products.unavailable}
          detail="Public nhưng hết hàng hoặc unavailable"
          accent="bg-warning"
        />
        <MetricCard
          label="Tổng đơn hàng"
          value={dashboard.orders.total}
          detail="Theo vòng đời Order canonical"
          accent="bg-secondary"
        />
        <MetricCard
          label="Tổng đánh giá"
          value={dashboard.reviews.total}
          detail="Review chưa xóa mềm"
          accent="bg-primary"
        />
      </section>

      {noData ? (
        <EmptyState
          title="Chưa có dữ liệu vận hành"
          description="Dashboard sẽ cập nhật khi Product, Order hoặc Review đầu tiên được ghi nhận."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <Card aria-labelledby="order-status-title" className="p-0">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h2 id="order-status-title" className="font-bold text-neutral-950">
                Đơn hàng theo trạng thái
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Không suy diễn doanh thu hoặc lợi nhuận.
              </p>
            </div>
            <dl className="divide-y divide-neutral-100">
              {Object.entries(dashboard.orders.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <dt className="text-sm font-medium text-neutral-700">
                    {orderLabels[status as keyof typeof orderLabels]}
                  </dt>
                  <dd className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-bold text-neutral-950">
                    {numberFormat.format(count)}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card aria-labelledby="review-status-title" className="p-0">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h2 id="review-status-title" className="font-bold text-neutral-950">
                Trạng thái đánh giá
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Không có metric chờ duyệt vì lifecycle hiện tại chưa hỗ trợ pending.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-px bg-neutral-200">
              <ReviewStatus label="Đã đăng" value={dashboard.reviews.byStatus.published} />
              <ReviewStatus label="Đã ẩn" value={dashboard.reviews.byStatus.hidden} />
              <ReviewStatus label="Từ chối" value={dashboard.reviews.byStatus.rejected} />
            </dl>
          </Card>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: number;
  detail: string;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-card border border-neutral-200 bg-white shadow-soft">
      <span className={`absolute inset-y-0 left-0 w-1 ${accent}`} aria-hidden="true" />
      <StatCard label={label} value={numberFormat.format(value)} detail={detail} />
    </div>
  );
}

function ReviewStatus({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white px-3 py-5 text-center">
      <dt className="text-xs font-medium text-neutral-500">{label}</dt>
      <dd className="mt-2 text-xl font-bold text-neutral-950">{numberFormat.format(value)}</dd>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Đang tải dashboard" className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="rounded-card border border-neutral-200 bg-white p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-16" />
            <Skeleton className="mt-3 h-3 w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <span className="sr-only">Đang tải dữ liệu vận hành…</span>
    </div>
  );
}
