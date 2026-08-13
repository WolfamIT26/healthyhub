import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductCatalogPage } from '../../pages/ProductCatalogPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { CartPage } from '../../pages/CartPage';
import { RouteGuard } from '../../routes/RouteGuard';
import { useAuth } from '../auth/AuthContext';
import { authApi } from '../auth/authApi';
import { WishlistProvider } from '../wishlist/WishlistContext';
import { CartProvider, useCart } from './CartContext';
import { cartApi } from './cartApi';
import type { ServerCart, ServerCartItem } from './cart.types';
import { catalogProducts } from '../products/catalog.data';

vi.mock('../auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../auth/authApi', () => ({ authApi: { resendVerification: vi.fn() } }));
vi.mock('./cartApi', () => ({
  cartApi: { get: vi.fn(), add: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));

const guestAuth = {
  status: 'guest' as const,
  actor: null,
  current: null,
  login: vi.fn(),
  logout: vi.fn(),
  hasRole: vi.fn(() => false),
  hasPermission: vi.fn(),
};
const customerAuth = {
  ...guestAuth,
  status: 'authenticated' as const,
  actor: {
    id: 'customer-1',
    email: 'customer@example.com',
    fullName: 'Customer',
    roles: ['CUSTOMER'] as Array<'CUSTOMER'>,
    isEmailVerified: true,
  },
  hasRole: vi.fn((role) => role === 'CUSTOMER'),
};
const unverifiedAuth = {
  ...customerAuth,
  actor: {
    ...customerAuth.actor,
    id: 'customer-2',
    email: 'pending@example.com',
    isEmailVerified: false,
  },
};

function CartTestControls() {
  const cart = useCart();
  return (
    <div className="sr-only">
      <Link to="/cart">Mở Cart test</Link>
      <button
        type="button"
        onClick={() => {
          void cart.add('5', 1);
        }}
      >
        Seed out-of-stock
      </button>
    </div>
  );
}

function renderFlow(entry = '/products/oat-milk-original') {
  return render(<CartFlow entry={entry} />);
}

function CartFlow({ entry }: { entry: string }) {
  return (
    <MemoryRouter initialEntries={[entry]}>
      <WishlistProvider>
        <CartProvider>
          <CartTestControls />
          <Routes>
            <Route path="/products" element={<ProductCatalogPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route
              path="/cart"
              element={
                <RouteGuard area="customer">
                  <CartPage />
                </RouteGuard>
              }
            />
            <Route path="/login" element={<p>Trang đăng nhập</p>} />
            <Route path="/checkout" element={<p>Checkout foundation</p>} />
            <Route path="/verify-email" element={<p>Trang xác minh</p>} />
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </MemoryRouter>
  );
}

async function addOatMilkAndOpenCart(times = 1) {
  const add = screen.getByRole('button', { name: 'Thêm Sữa yến mạch nguyên bản vào giỏ hàng' });
  for (let index = 0; index < times; index += 1) await userEvent.click(add);
  await userEvent.click(screen.getByRole('link', { name: 'Mở Cart test' }));
}

describe('Shopping Cart V1 frontend foundation', () => {
  let serverItems: ServerCartItem[];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue(guestAuth);
    serverItems = [];
    vi.mocked(cartApi.get).mockImplementation(async () => serverCart(serverItems));
    vi.mocked(cartApi.add).mockImplementation(async (productId, quantity) => {
      const existing = serverItems.find((item) => item.productId === productId);
      if (existing) existing.quantity += quantity;
      else serverItems.push(serverItem(productId, quantity));
      return serverCart(serverItems);
    });
    vi.mocked(cartApi.update).mockImplementation(async (cartItemId, quantity) => {
      serverItems = serverItems.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity, lineTotal: String(Number(item.unitPrice) * quantity) }
          : item,
      );
      return serverCart(serverItems);
    });
    vi.mocked(cartApi.remove).mockImplementation(async (cartItemId) => {
      serverItems = serverItems.filter((item) => item.id !== cartItemId);
      return serverCart(serverItems);
    });
  });

  it('does not fake-add for guests and offers Login with safe return routing', async () => {
    renderFlow();
    await userEvent.click(
      screen.getByRole('button', { name: 'Thêm Sữa yến mạch nguyên bản vào giỏ hàng' }),
    );
    const dialog = screen.getByRole('dialog', { name: 'Đăng nhập để thêm sản phẩm vào giỏ hàng.' });
    expect(within(dialog).getByText(/không được lưu giả/)).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Đăng nhập' }));
    expect(await screen.findByText('Trang đăng nhập')).toBeInTheDocument();
  });

  it('fetches the Customer Cart on initial mount and renders loading state', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    let resolveCart!: (cart: ServerCart) => void;
    vi.mocked(cartApi.get).mockReturnValue(
      new Promise((resolve) => {
        resolveCart = resolve;
      }),
    );
    renderFlow('/cart');
    expect(screen.getByLabelText('Đang tải giỏ hàng')).toBeInTheDocument();
    resolveCart(serverCart([]));
    expect(await screen.findByText('Giỏ hàng của bạn đang trống.')).toBeInTheDocument();
    expect(cartApi.get).toHaveBeenCalledTimes(1);
  });

  it('renders a safe retry state when initial Cart load fails', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    vi.mocked(cartApi.get).mockRejectedValue(new Error('network'));
    renderFlow('/cart');
    expect(await screen.findByText('Không thể tải giỏ hàng')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Thử lại' })).toBeInTheDocument();
  });

  it('adds for an authenticated Customer and merges duplicate quantity into one line', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow();
    await addOatMilkAndOpenCart(2);
    expect(screen.getByText('2 sản phẩm')).toBeInTheDocument();
    expect(screen.getAllByText('Sữa yến mạch nguyên bản')).toHaveLength(1);
    expect(
      screen.getByRole('spinbutton', { name: 'Số lượng Sữa yến mạch nguyên bản' }),
    ).toHaveValue(2);
    expect(cartApi.add).toHaveBeenCalledTimes(2);
  });

  it('keeps server persistence across provider remount for the same Customer', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    const first = renderFlow();
    await addOatMilkAndOpenCart();
    expect(screen.getByText('1 sản phẩm')).toBeInTheDocument();
    first.unmount();
    renderFlow('/cart');
    expect(await screen.findByText('Sữa yến mạch nguyên bản')).toBeInTheDocument();
    expect(cartApi.get).toHaveBeenCalledTimes(2);
  });

  it('does not report add success when the Cart server rejects the mutation', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    vi.mocked(cartApi.add).mockRejectedValue(new Error('insufficient stock'));
    renderFlow();
    await userEvent.click(
      screen.getByRole('button', { name: 'Thêm Sữa yến mạch nguyên bản vào giỏ hàng' }),
    );
    expect(await screen.findByText('Không thể thêm sản phẩm vào giỏ hàng.')).toBeInTheDocument();
  });

  it('allows an unverified Customer to add and use Cart', async () => {
    vi.mocked(useAuth).mockReturnValue(unverifiedAuth);
    renderFlow();
    await addOatMilkAndOpenCart();
    expect(screen.getByText('1 sản phẩm')).toBeInTheDocument();
  });

  it('increases, decreases and validates direct quantity input', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow();
    await addOatMilkAndOpenCart();
    await userEvent.click(
      screen.getByRole('button', { name: 'Tăng số lượng Sữa yến mạch nguyên bản' }),
    );
    expect(
      screen.getByRole('spinbutton', { name: 'Số lượng Sữa yến mạch nguyên bản' }),
    ).toHaveValue(2);
    await userEvent.click(
      screen.getByRole('button', { name: 'Giảm số lượng Sữa yến mạch nguyên bản' }),
    );
    expect(
      screen.getByRole('spinbutton', { name: 'Số lượng Sữa yến mạch nguyên bản' }),
    ).toHaveValue(1);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Số lượng Sữa yến mạch nguyên bản' }), {
      target: { value: '1.5' },
    });
    expect(screen.getByRole('alert')).toHaveTextContent('số nguyên từ 1 đến 9999');
  });

  it('removes an item and returns to the empty state', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow();
    await addOatMilkAndOpenCart();
    await userEvent.click(
      screen.getByRole('button', { name: 'Xóa Sữa yến mạch nguyên bản khỏi giỏ hàng' }),
    );
    expect(screen.getByText('Giỏ hàng của bạn đang trống.')).toBeInTheDocument();
  });

  it('renders the protected empty Cart page and discovery CTA', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow('/cart');
    expect(screen.getByRole('heading', { level: 1, name: 'Giỏ hàng của bạn' })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Khám phá sản phẩm' })).toHaveAttribute(
      'href',
      '/products',
    );
  });

  it('keeps an out-of-stock item visible and blocks Checkout', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow();
    await userEvent.click(screen.getByRole('button', { name: 'Seed out-of-stock' }));
    await userEvent.click(screen.getByRole('link', { name: 'Mở Cart test' }));
    expect(screen.getByText('Sữa chua dừa vị xoài')).toBeInTheDocument();
    expect(screen.getByText(/không đủ điều kiện Checkout/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Checkout chưa khả dụng' })).toBeDisabled();
  });

  it('renders semantic Cart summary and presentation subtotal', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow();
    await addOatMilkAndOpenCart();
    const summary = screen.getByLabelText('Tóm tắt giỏ hàng');
    expect(within(summary).getByText(/69\.000/)).toBeInTheDocument();
    expect(within(summary).getByText(/máy chủ xác nhận lại/)).toBeInTheDocument();
  });

  it('sends a verified Customer only to Checkout foundation', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow();
    await addOatMilkAndOpenCart();
    await userEvent.click(screen.getByRole('link', { name: 'Tiến hành Checkout' }));
    expect(await screen.findByText('Checkout foundation')).toBeInTheDocument();
  });

  it('gates Checkout for an unverified Customer and supports resend verification', async () => {
    vi.mocked(useAuth).mockReturnValue(unverifiedAuth);
    vi.mocked(authApi.resendVerification).mockResolvedValue({ accepted: true });
    renderFlow();
    await addOatMilkAndOpenCart();
    await userEvent.click(screen.getByRole('button', { name: 'Tiến hành Checkout' }));
    const dialog = screen.getByRole('dialog', {
      name: 'Bạn cần xác minh email trước khi thanh toán.',
    });
    expect(within(dialog).getByRole('link', { name: 'Xác minh ngay' })).toHaveAttribute(
      'href',
      '/verify-email',
    );
    await userEvent.click(within(dialog).getByRole('button', { name: 'Gửi lại email' }));
    expect(authApi.resendVerification).toHaveBeenCalledWith({ email: 'pending@example.com' });
    expect(await within(dialog).findByText('Email xác minh đã được gửi lại.')).toBeInTheDocument();
  });

  it('integrates accessible Add to Cart actions into Catalog ProductCards', () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow('/products');
    expect(screen.getAllByRole('button', { name: /Thêm .* vào giỏ hàng/ })).toHaveLength(20);
  });

  it('redirects a guest opening /cart through the existing guard', () => {
    renderFlow('/cart');
    expect(screen.getByText('Trang đăng nhập')).toBeInTheDocument();
  });
});

function serverItem(productId: string, quantity: number): ServerCartItem {
  const product = catalogProducts.find((candidate) => candidate.id === productId)!;
  const available = product.stockStatus !== 'out_of_stock';
  return {
    id: `item-${productId}`,
    productId,
    slug: product.slug,
    name: product.name,
    thumbnail: null,
    quantity,
    unitPrice: `${product.price}.00`,
    lineTotal: `${product.price * quantity}.00`,
    currency: 'VND',
    availability: available
      ? product.stockStatus === 'low_stock'
        ? 'LOW_STOCK'
        : 'AVAILABLE'
      : 'OUT_OF_STOCK',
    availableQuantity: available ? 10 : 0,
  };
}

function serverCart(items: ServerCartItem[]): ServerCart {
  return {
    id: 'cart-1',
    status: 'active',
    validationStatus: 'not_validated',
    items: items.map((item) => ({ ...item })),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: `${items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0)}.00`,
    currency: 'VND',
    isValid: items.every(
      (item) => item.availability === 'AVAILABLE' || item.availability === 'LOW_STOCK',
    ),
    updatedAt: new Date().toISOString(),
  };
}
