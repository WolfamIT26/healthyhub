import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '../features/auth/AuthContext';
import { useCart } from '../features/cart/CartContext';
import { checkoutApi } from '../features/checkout/checkoutApi';
import { CheckoutPage } from './CheckoutPage';

vi.mock('../features/auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../features/cart/CartContext', () => ({ useCart: vi.fn() }));
vi.mock('../features/checkout/checkoutApi', () => ({
  checkoutApi: { quoteShipping: vi.fn(), createOrder: vi.fn() },
}));

const reload = vi.fn().mockResolvedValue(undefined);
const item = {
  id: '1',
  productId: '11',
  slug: 'oat',
  name: 'Oat Milk',
  thumbnail: null,
  quantity: 2,
  unitPrice: '125000.00',
  lineTotal: '250000.00',
  currency: 'VND' as const,
  availability: 'AVAILABLE' as const,
  availableQuantity: 5,
};

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      actor: {
        id: '1',
        email: 'customer@example.test',
        fullName: 'Nguyễn Văn A',
        roles: ['CUSTOMER'],
        isEmailVerified: true,
      },
      status: 'authenticated',
    } as never);
    vi.mocked(useCart).mockReturnValue({
      cart: {
        id: '1',
        status: 'active',
        validationStatus: 'valid',
        itemCount: 2,
        items: [item],
        subtotal: '250000.00',
        currency: 'VND',
        isValid: true,
        updatedAt: new Date().toISOString(),
      },
      items: [item],
      itemCount: 2,
      loading: false,
      error: null,
      reload,
    } as never);
    vi.mocked(checkoutApi.quoteShipping).mockResolvedValue({
      quoteReference: 'shq_valid',
      methodCode: 'manual',
      methodName: 'Giao hàng tiêu chuẩn HealthyHub',
      shippingFee: '0.00',
      currency: 'VND',
      available: true,
      estimatedDelivery: null,
    });
    vi.mocked(checkoutApi.createOrder).mockResolvedValue({
      orderId: '91',
      orderNumber: 'HH-20260809-ABC',
      status: 'new',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      shippingStatus: 'pending',
      shippingMethod: 'manual',
      items: [],
      subtotal: '250000.00',
      shippingFee: '0.00',
      total: '250000.00',
      currency: 'VND',
      shippingAddress: {},
      createdAt: new Date().toISOString(),
    });
  });

  it('blocks an unverified Customer before loading Checkout authorities', async () => {
    vi.mocked(useAuth).mockReturnValue({
      actor: {
        id: '1',
        email: 'customer@example.test',
        fullName: 'A',
        roles: ['CUSTOMER'],
        isEmailVerified: false,
      },
      status: 'authenticated',
    } as never);
    renderPage();
    expect(
      await screen.findByText('Bạn cần xác minh email trước khi thanh toán.'),
    ).toBeInTheDocument();
  });

  it('loads authoritative Cart and COD method and renders an empty Cart state', async () => {
    renderPage();
    expect(
      await screen.findByText('Thanh toán khi nhận hàng — trạng thái ban đầu: Chờ thanh toán'),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/250\.000/).length).toBeGreaterThan(0);
    expect(reload).toHaveBeenCalled();

    vi.mocked(useCart).mockReturnValue({
      cart: {
        id: '1',
        status: 'active',
        validationStatus: 'valid',
        itemCount: 0,
        items: [],
        subtotal: '0.00',
        currency: 'VND',
        isValid: true,
        updatedAt: new Date().toISOString(),
      },
      items: [],
      itemCount: 0,
      loading: false,
      error: null,
      reload,
    } as never);
    renderPage();
    expect(await screen.findByText('Giỏ hàng của bạn đang trống')).toBeInTheDocument();
  });

  it('validates recipient fields before requesting a Shipping quote', async () => {
    renderPage();
    await screen.findByText('Thanh toán khi nhận hàng — trạng thái ban đầu: Chờ thanh toán');
    await userEvent.click(screen.getByRole('button', { name: 'Kiểm tra giao hàng' }));
    expect(await screen.findAllByText('Trường này là bắt buộc.')).toHaveLength(4);
    expect(checkoutApi.quoteShipping).not.toHaveBeenCalled();
  });

  it('quotes Shipping, prevents duplicate confirm and only shows persisted success', async () => {
    let resolveOrder!: (value: Awaited<ReturnType<typeof checkoutApi.createOrder>>) => void;
    vi.mocked(checkoutApi.createOrder).mockReturnValue(
      new Promise((resolve) => {
        resolveOrder = resolve;
      }),
    );
    renderPage();
    await fillAddress();
    await userEvent.click(screen.getByRole('button', { name: 'Kiểm tra giao hàng' }));
    const confirm = await screen.findByRole('button', { name: 'Xác nhận đặt hàng' });
    fireEvent.click(confirm);
    fireEvent.click(confirm);
    expect(checkoutApi.createOrder).toHaveBeenCalledTimes(1);
    const firstKey = vi.mocked(checkoutApi.createOrder).mock.calls[0][2];
    expect(firstKey).toMatch(/^checkout-/);
    expect(screen.queryByText('Đặt hàng thành công')).not.toBeInTheDocument();
    resolveOrder({
      orderId: '91',
      orderNumber: 'HH-20260809-ABC',
      status: 'new',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      shippingStatus: 'pending',
      shippingMethod: 'manual',
      items: [],
      subtotal: '250000.00',
      shippingFee: '0.00',
      total: '250000.00',
      currency: 'VND',
      shippingAddress: {},
      createdAt: new Date().toISOString(),
    });
    expect(await screen.findByText('Đặt hàng thành công')).toBeInTheDocument();
    expect(screen.getByText(/HH-20260809-ABC/)).toBeInTheDocument();
  });

  it('keeps the idempotency key for a safe retry after Order failure', async () => {
    vi.mocked(checkoutApi.createOrder)
      .mockRejectedValueOnce({ message: 'Mạng lỗi', code: 'NETWORK' })
      .mockResolvedValueOnce({
        orderId: '91',
        orderNumber: 'HH-RETRY',
        status: 'new',
        paymentStatus: 'pending',
        paymentMethod: 'cod',
        shippingStatus: 'pending',
        shippingMethod: 'manual',
        items: [],
        subtotal: '250000.00',
        shippingFee: '0.00',
        total: '250000.00',
        currency: 'VND',
        shippingAddress: {},
        createdAt: new Date().toISOString(),
      });
    renderPage();
    await fillAddress();
    await userEvent.click(screen.getByRole('button', { name: 'Kiểm tra giao hàng' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Xác nhận đặt hàng' }));
    expect(await screen.findByText(/Mạng lỗi/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Kiểm tra lại và xác nhận' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Xác nhận đặt hàng' }));
    await screen.findByText('Đặt hàng thành công');
    expect(vi.mocked(checkoutApi.createOrder).mock.calls[0][2]).toBe(
      vi.mocked(checkoutApi.createOrder).mock.calls[1][2],
    );
  });
});

function renderPage() {
  return render(
    <MemoryRouter>
      <CheckoutPage />
    </MemoryRouter>,
  );
}
async function fillAddress() {
  await screen.findByText('Thanh toán khi nhận hàng — trạng thái ban đầu: Chờ thanh toán');
  await userEvent.type(screen.getByLabelText(/Số điện thoại/), '0901234567');
  await userEvent.type(screen.getByLabelText(/Tỉnh \/ Thành phố/), 'Hồ Chí Minh');
  await userEvent.type(screen.getByLabelText(/Quận \/ Huyện/), 'Quận 1');
  await userEvent.type(screen.getByLabelText(/Địa chỉ cụ thể/), '12 Nguyễn Huệ');
}
