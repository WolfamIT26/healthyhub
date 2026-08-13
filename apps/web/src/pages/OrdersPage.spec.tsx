import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { orderApi } from '../features/orders/orderApi';
import type { CustomerOrderListItem } from '../features/orders/order.types';
import { OrdersPage } from './OrdersPage';

vi.mock('../features/orders/orderApi', () => ({
  orderApi: { list: vi.fn(), detail: vi.fn() },
}));

describe('OrdersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(orderApi.list).mockResolvedValue(pageResult([]));
  });

  it('renders a skeleton while loading', () => {
    vi.mocked(orderApi.list).mockReturnValue(new Promise(() => undefined));
    renderPage();
    expect(screen.getByRole('status', { name: 'Đang tải đơn hàng' })).toBeInTheDocument();
  });

  it('renders the empty state with a product discovery link', async () => {
    renderPage();
    expect(await screen.findByText('Bạn chưa có đơn hàng')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Khám phá sản phẩm' })).toHaveAttribute(
      'href',
      '/products',
    );
  });

  it('renders populated COD/VNPAY state and responsive order cards', async () => {
    vi.mocked(orderApi.list).mockResolvedValue(
      pageResult([
        order({ orderId: '12', method: 'vnpay', paymentStatus: 'paid', status: 'confirmed' }),
        order({ orderId: '11', method: 'cod', paymentStatus: 'pending', status: 'new' }),
      ]),
    );
    renderPage();

    expect(await screen.findByText('HH-20260813-12')).toBeInTheDocument();
    expect(screen.getAllByText('Đã thanh toán').length).toBeGreaterThan(1);
    expect(screen.getByText('Thanh toán khi nhận hàng (COD)')).toBeInTheDocument();
    expect(screen.getByTestId('order-list')).toHaveClass('grid');
    expect(screen.getByRole('link', { name: 'HH-20260813-12' })).toHaveAttribute(
      'href',
      '/orders/12',
    );
  });

  it('keeps pagination and status filters in URL-backed server queries', async () => {
    vi.mocked(orderApi.list).mockResolvedValue(
      pageResult(
        [order({ orderId: '12', method: 'vnpay', paymentStatus: 'paid', status: 'confirmed' })],
        {
          page: 2,
          totalItems: 21,
          totalPages: 2,
          hasPreviousPage: true,
          hasNextPage: false,
        },
      ),
    );
    renderPage('/orders?page=2');
    expect(await screen.findByText('Trang 2 / 2')).toBeInTheDocument();
    expect(orderApi.list).toHaveBeenCalledWith({
      page: 2,
      pageSize: 20,
      orderStatus: undefined,
      paymentStatus: undefined,
    });

    await userEvent.selectOptions(screen.getByLabelText('Lọc theo trạng thái thanh toán'), 'paid');
    await waitFor(() =>
      expect(orderApi.list).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 20,
        orderStatus: undefined,
        paymentStatus: 'paid',
      }),
    );
  });

  it('moves to the next page while preserving filters', async () => {
    vi.mocked(orderApi.list).mockResolvedValue(
      pageResult(
        [order({ orderId: '11', method: 'cod', paymentStatus: 'pending', status: 'new' })],
        {
          totalItems: 21,
          totalPages: 2,
          hasNextPage: true,
        },
      ),
    );
    renderPage('/orders?orderStatus=new');
    await screen.findByText('Trang 1 / 2');
    await userEvent.click(screen.getByRole('button', { name: 'Trang sau' }));
    await waitFor(() =>
      expect(orderApi.list).toHaveBeenLastCalledWith({
        page: 2,
        pageSize: 20,
        orderStatus: 'new',
        paymentStatus: undefined,
      }),
    );
  });

  it('renders an API error and supports retry', async () => {
    vi.mocked(orderApi.list).mockRejectedValueOnce({ message: 'Máy chủ tạm thời không phản hồi.' });
    renderPage();
    expect(await screen.findByText('Không thể tải danh sách đơn hàng')).toBeInTheDocument();
    expect(screen.getByText('Máy chủ tạm thời không phản hồi.')).toBeInTheDocument();

    vi.mocked(orderApi.list).mockResolvedValueOnce(pageResult([]));
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
    expect(await screen.findByText('Bạn chưa có đơn hàng')).toBeInTheDocument();
  });
});

function renderPage(initialEntry = '/orders') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function order({
  orderId,
  method,
  paymentStatus,
  status,
}: {
  orderId: string;
  method: 'cod' | 'vnpay';
  paymentStatus: 'pending' | 'paid';
  status: 'new' | 'confirmed';
}): CustomerOrderListItem {
  return {
    orderId,
    orderNumber: `HH-20260813-${orderId}`,
    orderStatus: status,
    paymentStatus,
    paymentMethod: method,
    shippingStatus: 'pending',
    itemCount: 2,
    total: '250000.00',
    currency: 'VND',
    createdAt: '2026-08-13T08:00:00.000Z',
  };
}

function pageResult(
  items: CustomerOrderListItem[],
  pagination: Partial<{
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> = {},
) {
  return {
    items,
    pagination: {
      page: 1,
      pageSize: 20,
      totalItems: items.length,
      totalPages: items.length ? 1 : 0,
      hasNextPage: false,
      hasPreviousPage: false,
      ...pagination,
    },
  };
}
