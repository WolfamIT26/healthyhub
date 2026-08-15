import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductCatalogPage } from '../../pages/ProductCatalogPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { WishlistPage } from '../../pages/WishlistPage';
import { RouteGuard } from '../../routes/RouteGuard';
import { useAuth } from '../auth/AuthContext';
import { CartProvider } from '../cart/CartContext';
import { catalogProducts } from '../products/catalog.data';
import type { ServerWishlist, ServerWishlistItem } from './wishlist.types';
import { WishlistProvider, useWishlist } from './WishlistContext';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
  cartGet: vi.fn(),
}));

vi.mock('../auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('./wishlistApi', () => ({
  wishlistApi: { get: mocks.get, add: mocks.add, remove: mocks.remove },
}));
vi.mock('../cart/cartApi', () => ({
  cartApi: {
    get: mocks.cartGet,
    add: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
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
  actor: { ...customerAuth.actor, id: 'customer-2', isEmailVerified: false },
};
const internalAuth = {
  ...customerAuth,
  actor: { ...customerAuth.actor, id: 'internal-1', roles: ['ADMINISTRATOR'] as never[] },
  hasRole: vi.fn(() => false),
};
const serverByActor = new Map<string, ServerWishlistItem[]>();
let activeActorId: string | null = null;
let activeAuth:
  typeof guestAuth | typeof customerAuth | typeof unverifiedAuth | typeof internalAuth;

function setAuth(auth: typeof activeAuth) {
  activeAuth = auth;
  activeActorId = auth.status === 'authenticated' ? auth.actor.id : null;
  vi.mocked(useAuth).mockImplementation(() => activeAuth as never);
}

function item(productId: string): ServerWishlistItem {
  const product = catalogProducts.find((candidate) => candidate.id === productId)!;
  return {
    wishlistItemId: `wishlist-item-${productId}`,
    product: {
      productId,
      name: product.name,
      slug: product.slug,
      thumbnail: null,
      currentPrice: `${product.price}.00`,
      currency: 'VND',
      availability:
        product.stockStatus === 'out_of_stock'
          ? 'OUT_OF_STOCK'
          : product.stockStatus === 'low_stock'
            ? 'LOW_STOCK'
            : 'AVAILABLE',
    },
    addedAt: '2026-08-13T00:00:00.000Z',
  };
}

function page(items: ServerWishlistItem[]): ServerWishlist {
  return {
    items: [...items],
    page: 1,
    pageSize: 60,
    totalItems: items.length,
    totalPages: items.length ? 1 : 0,
  };
}

function renderFlow(entry = '/products') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <WishlistProvider>
        <CartProvider>
          <Link className="sr-only" to="/wishlist">
            Mở Wishlist test
          </Link>
          <Routes>
            <Route
              path="/products"
              element={<ProductCatalogPage products={catalogProducts} status="success" />}
            />
            <Route
              path="/products/:slug"
              element={<ProductDetailPage products={catalogProducts} status="success" />}
            />
            <Route
              path="/wishlist"
              element={
                <RouteGuard area="customer">
                  <WishlistPage />
                </RouteGuard>
              }
            />
            <Route path="/login" element={<p>Trang đăng nhập</p>} />
            <Route path="/403" element={<p>Trang không có quyền</p>} />
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </MemoryRouter>,
  );
}

describe('Wishlist V1 server persistence frontend', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    serverByActor.clear();
    setAuth(guestAuth);
    mocks.get.mockImplementation(async () => {
      const actorId = activeActorId;
      return page(actorId ? (serverByActor.get(actorId) ?? []) : []);
    });
    mocks.add.mockImplementation(async (productId: string) => {
      if (!activeActorId) throw new Error('guest');
      const items = serverByActor.get(activeActorId) ?? [];
      const existing = items.find((candidate) => candidate.product.productId === productId);
      if (existing) return existing;
      const created = item(productId);
      serverByActor.set(activeActorId, [...items, created]);
      return created;
    });
    mocks.remove.mockImplementation(async (productId: string) => {
      if (!activeActorId) throw new Error('guest');
      serverByActor.set(
        activeActorId,
        (serverByActor.get(activeActorId) ?? []).filter(
          (candidate) => candidate.product.productId !== productId,
        ),
      );
      return { productId, deleted: true };
    });
    mocks.cartGet.mockResolvedValue({
      id: 'cart',
      items: [],
      itemCount: 0,
      subtotal: '0.00',
      currency: 'VND',
    });
  });

  it('does not call Wishlist API for guests and offers login with safe return routing', async () => {
    renderFlow('/products/oat-milk-original');
    await userEvent.click(
      screen.getByRole('button', { name: 'Thêm Sữa yến mạch nguyên bản vào yêu thích' }),
    );
    const dialog = screen.getByRole('dialog', { name: 'Đăng nhập để lưu sản phẩm yêu thích.' });
    expect(within(dialog).getByText(/không được lưu giả/)).toBeInTheDocument();
    expect(mocks.get).not.toHaveBeenCalled();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Đăng nhập' }));
    expect(await screen.findByText('Trang đăng nhập')).toBeInTheDocument();
  });

  it('fetches initial server state and exposes accessible pressed state', async () => {
    setAuth(customerAuth);
    serverByActor.set('customer-1', [item('1')]);
    renderFlow('/products/oat-milk-original');
    expect(
      await screen.findByRole('button', { name: 'Xóa Sữa yến mạch nguyên bản khỏi yêu thích' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(mocks.get).toHaveBeenCalled();
  });

  it('adds and removes through the server then reloads authoritative state', async () => {
    setAuth(customerAuth);
    renderFlow('/products/oat-milk-original');
    const add = await screen.findByRole('button', {
      name: 'Thêm Sữa yến mạch nguyên bản vào yêu thích',
    });
    await userEvent.click(add);
    const remove = await screen.findByRole('button', {
      name: 'Xóa Sữa yến mạch nguyên bản khỏi yêu thích',
    });
    expect(mocks.add).toHaveBeenCalledWith('1');
    await userEvent.click(remove);
    expect(
      await screen.findByRole('button', { name: 'Thêm Sữa yến mạch nguyên bản vào yêu thích' }),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(mocks.remove).toHaveBeenCalledWith('1');
  });

  it('suppresses a rapid duplicate click while the same Product mutation is pending', async () => {
    setAuth(customerAuth);
    let release!: (value: ServerWishlistItem) => void;
    mocks.add.mockImplementationOnce(
      () => new Promise<ServerWishlistItem>((resolve) => (release = resolve)),
    );
    renderFlow('/products/oat-milk-original');
    const add = await screen.findByRole('button', {
      name: 'Thêm Sữa yến mạch nguyên bản vào yêu thích',
    });
    await userEvent.click(add);
    expect(add).toBeDisabled();
    await userEvent.click(add);
    expect(mocks.add).toHaveBeenCalledTimes(1);
    serverByActor.set('customer-1', [item('1')]);
    release(item('1'));
    expect(
      await screen.findByRole('button', { name: 'Xóa Sữa yến mạch nguyên bản khỏi yêu thích' }),
    ).toBeInTheDocument();
  });

  it('allows an unverified Customer to use Wishlist', async () => {
    setAuth(unverifiedAuth);
    renderFlow('/products/oat-milk-original');
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Thêm Sữa yến mạch nguyên bản vào yêu thích',
      }),
    );
    expect(
      await screen.findByRole('button', { name: 'Xóa Sữa yến mạch nguyên bản khỏi yêu thích' }),
    ).toBeInTheDocument();
  });

  it('renders loading, error and retry states from server synchronization', async () => {
    setAuth(customerAuth);
    let reject!: (error: Error) => void;
    mocks.get.mockImplementationOnce(
      () => new Promise((_resolve, rejectPromise) => (reject = rejectPromise)),
    );
    renderFlow('/wishlist');
    expect(screen.getByLabelText('Đang tải Wishlist')).toBeInTheDocument();
    reject(new Error('network'));
    expect(
      await screen.findByRole('heading', { name: 'Không thể tải Wishlist' }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
    expect(await screen.findByText('Bạn chưa có sản phẩm yêu thích.')).toBeInTheDocument();
  });

  it('persists across unmount/reload and keeps out-of-stock presentation', async () => {
    setAuth(customerAuth);
    serverByActor.set('customer-1', [item('5')]);
    const first = renderFlow('/wishlist');
    expect(await screen.findByText('1 sản phẩm')).toBeInTheDocument();
    expect(screen.getAllByText('Sữa chua dừa vị xoài')).toHaveLength(1);
    expect(screen.getAllByText('Hết hàng').length).toBeGreaterThan(0);
    first.unmount();
    renderFlow('/wishlist');
    expect(await screen.findByText('1 sản phẩm')).toBeInTheDocument();
    expect(mocks.get.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('clears client state on logout, reloads the same account and isolates account switch', async () => {
    serverByActor.set('customer-1', [item('1')]);
    setAuth(customerAuth);
    const view = render(<AccountProbeTree />);
    expect(await screen.findByTestId('wishlist-probe')).toHaveTextContent('1:1');

    setAuth(guestAuth);
    view.rerender(<AccountProbeTree />);
    expect(await screen.findByTestId('wishlist-probe')).toHaveTextContent('0:');

    setAuth(customerAuth);
    view.rerender(<AccountProbeTree />);
    expect(await screen.findByTestId('wishlist-probe')).toHaveTextContent('1:1');

    setAuth({ ...customerAuth, actor: { ...customerAuth.actor, id: 'customer-b' } });
    view.rerender(<AccountProbeTree />);
    expect(await screen.findByTestId('wishlist-probe')).toHaveTextContent('0:');
  });

  it('keeps empty discovery UX and Catalog Wishlist actions', async () => {
    setAuth(customerAuth);
    renderFlow('/wishlist');
    expect(await screen.findByText('Bạn chưa có sản phẩm yêu thích.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Khám phá sản phẩm' })).toHaveAttribute(
      'href',
      '/products',
    );
    renderFlow('/products');
    expect(screen.getAllByRole('button', { name: /Thêm .* vào yêu thích/ })).toHaveLength(20);
  });

  it.each([
    ['guest', guestAuth, 'Trang đăng nhập'],
    ['Internal', internalAuth, 'Trang không có quyền'],
  ])('protects Wishlist from %s access', async (_label, auth, expected) => {
    setAuth(auth);
    renderFlow('/wishlist');
    expect(await screen.findByText(expected)).toBeInTheDocument();
  });
});

function AccountProbeTree() {
  return (
    <MemoryRouter>
      <WishlistProvider>
        <WishlistProbe />
      </WishlistProvider>
    </MemoryRouter>
  );
}

function WishlistProbe() {
  const wishlist = useWishlist();
  return (
    <p data-testid="wishlist-probe">
      {wishlist.items.length}:{wishlist.productIds.join(',')}
    </p>
  );
}
