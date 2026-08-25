import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminHomePage } from '../../pages/AdminHomePage';
import { adminApi } from './adminApi';

vi.mock('./adminApi', () => ({ adminApi: { dashboard: vi.fn() } }));

const dashboard = {
  generatedAt: '2026-08-25T10:00:00.000Z',
  products: { total: 12, activePublic: 8, unavailable: 2 },
  orders: {
    total: 9,
    byStatus: { new: 2, confirmed: 3, completed: 2, cancelled: 1, returned: 1 },
  },
  reviews: { total: 5, byStatus: { published: 4, hidden: 1, rejected: 0 } },
};

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminHomePage />
    </MemoryRouter>,
  );
}

describe('Admin Dashboard V1', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders a stable loading skeleton while authoritative metrics load', () => {
    vi.mocked(adminApi.dashboard).mockReturnValue(new Promise(() => undefined));
    renderPage();
    expect(screen.getByRole('status', { name: 'Đang tải dashboard' })).toBeInTheDocument();
  });

  it('renders authoritative Product, Order and Review aggregates without fake analytics', async () => {
    vi.mocked(adminApi.dashboard).mockResolvedValue(dashboard);
    renderPage();

    expect(await screen.findByText('12')).toBeInTheDocument();
    expect(screen.getByText('Đang công khai')).toBeInTheDocument();
    expect(screen.getByText('Không sẵn sàng')).toBeInTheDocument();
    expect(screen.getByText('Đơn hàng theo trạng thái')).toBeInTheDocument();
    expect(screen.getByText('Trạng thái đánh giá')).toBeInTheDocument();
    for (const inventedMetric of ['Doanh thu', 'Lợi nhuận', 'Tỷ lệ chuyển đổi']) {
      expect(screen.queryByText(inventedMetric)).not.toBeInTheDocument();
    }
  });

  it('shows an empty state when all authoritative sources are empty', async () => {
    vi.mocked(adminApi.dashboard).mockResolvedValue({
      ...dashboard,
      products: { total: 0, activePublic: 0, unavailable: 0 },
      orders: {
        total: 0,
        byStatus: { new: 0, confirmed: 0, completed: 0, cancelled: 0, returned: 0 },
      },
      reviews: { total: 0, byStatus: { published: 0, hidden: 0, rejected: 0 } },
    });
    renderPage();
    expect(await screen.findByText('Chưa có dữ liệu vận hành')).toBeInTheDocument();
  });

  it('renders an error and retries the same safe read', async () => {
    vi.mocked(adminApi.dashboard)
      .mockRejectedValueOnce({ message: 'Máy chủ tạm thời không phản hồi.', statusCode: 500 })
      .mockResolvedValueOnce(dashboard);
    renderPage();

    expect(await screen.findByText('Không tải được dashboard')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
    expect(await screen.findByText('Đơn hàng theo trạng thái')).toBeInTheDocument();
    expect(adminApi.dashboard).toHaveBeenCalledTimes(2);
  });

  it('renders a dedicated forbidden state for backend authorization rejection', async () => {
    vi.mocked(adminApi.dashboard).mockRejectedValue({
      message: 'Bạn không có quyền.',
      statusCode: 403,
    });
    renderPage();
    expect(await screen.findByText('Không đủ quyền xem dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Về cửa hàng' })).toHaveAttribute('href', '/');
  });
});
