import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { orderApi } from '../features/orders/orderApi';
import type { CustomerOrderDetail } from '../features/orders/order.types';
import { OrderDetailPage } from './OrderDetailPage';

vi.mock('../features/orders/orderApi', () => ({
  orderApi: { list: vi.fn(), detail: vi.fn() },
}));

describe('OrderDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(orderApi.detail).mockResolvedValue(detail());
  });

  it('loads direct/reloaded routes from the server using the URL orderId', async () => {
    renderPage('/orders/42');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'HH-20260813-42' }),
    ).toBeInTheDocument();
    expect(orderApi.detail).toHaveBeenCalledWith('42');
    expect(screen.getByText('Sản phẩm snapshot')).toBeInTheDocument();
    expect(
      screen.getByText('12 Nguyễn Huệ, Bến Nghé, Quận 1, Hồ Chí Minh, VN'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('order-detail-layout')).toHaveClass(
      'lg:grid-cols-[minmax(0,1fr)_360px]',
    );
  });

  it('renders the canonical COD pending state', async () => {
    renderPage('/orders/42');
    expect(await screen.findByText('Thanh toán khi nhận hàng (COD)')).toBeInTheDocument();
    expect(screen.getAllByText('Đang chờ thanh toán').length).toBeGreaterThan(0);
    expect(screen.queryByText('Tham chiếu VNPAY')).not.toBeInTheDocument();
  });

  it('renders persisted VNPAY information without inferring paid from browser state', async () => {
    vi.mocked(orderApi.detail).mockResolvedValue(
      detail({
        paymentMethod: 'vnpay',
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        providerReference: 'HHVNP42SAFE',
      }),
    );
    renderPage('/orders/42');

    expect(await screen.findByText('Tham chiếu VNPAY')).toBeInTheDocument();
    expect(screen.getByText('HHVNP42SAFE')).toBeInTheDocument();
    expect(screen.getAllByText('Đã thanh toán').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Đã xác nhận').length).toBeGreaterThan(0);
  });

  it('renders loading and not-owned/not-found error states without stale data', async () => {
    vi.mocked(orderApi.detail).mockReturnValueOnce(new Promise(() => undefined));
    const view = renderPage('/orders/99');
    expect(screen.getByRole('status', { name: 'Đang tải chi tiết đơn hàng' })).toBeInTheDocument();
    view.unmount();

    vi.mocked(orderApi.detail).mockRejectedValueOnce({ message: 'Không tìm thấy đơn hàng.' });
    renderPage('/orders/99');
    expect(await screen.findByText('Không thể tải chi tiết đơn hàng')).toBeInTheDocument();
    expect(screen.getByText('Không tìm thấy đơn hàng.')).toBeInTheDocument();
    expect(screen.queryByText('Sản phẩm snapshot')).not.toBeInTheDocument();
  });
});

function renderPage(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function detail(
  overrides: {
    paymentMethod?: 'cod' | 'vnpay';
    paymentStatus?: 'pending' | 'paid';
    orderStatus?: 'new' | 'confirmed';
    providerReference?: string | null;
  } = {},
): CustomerOrderDetail {
  const paymentMethod = overrides.paymentMethod ?? 'cod';
  const paymentStatus = overrides.paymentStatus ?? 'pending';
  const orderStatus = overrides.orderStatus ?? 'new';
  return {
    orderId: '42',
    orderNumber: 'HH-20260813-42',
    orderStatus,
    paymentStatus,
    paymentMethod,
    shippingStatus: 'pending',
    shippingMethod: 'manual',
    items: [
      {
        productId: '10',
        productName: 'Sản phẩm snapshot',
        sku: 'SKU-SNAPSHOT',
        unitPrice: '125000.00',
        quantity: 2,
        lineTotal: '250000.00',
      },
    ],
    subtotal: '250000.00',
    shippingFee: '0.00',
    total: '250000.00',
    currency: 'VND',
    shippingAddress: {
      recipientName: 'Nguyễn Văn A',
      phone: '0901234567',
      countryCode: 'VN',
      provinceCity: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Bến Nghé',
      addressLine: '12 Nguyễn Huệ',
      note: null,
    },
    payment: {
      paymentId: 'payment-42',
      method: paymentMethod,
      status: paymentStatus,
      amount: '250000.00',
      currency: 'VND',
      providerReference: overrides.providerReference ?? null,
      paidAt: paymentStatus === 'paid' ? '2026-08-13T08:05:00.000Z' : null,
      updatedAt: '2026-08-13T08:05:00.000Z',
    },
    shipping: {
      method: 'manual',
      status: 'pending',
      fee: '0.00',
      trackingReference: null,
      shippedAt: null,
      deliveredAt: null,
    },
    createdAt: '2026-08-13T08:00:00.000Z',
    placedAt: '2026-08-13T08:00:00.000Z',
    updatedAt: '2026-08-13T08:05:00.000Z',
    completedAt: null,
  };
}
