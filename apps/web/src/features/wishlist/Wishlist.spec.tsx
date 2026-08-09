import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductCatalogPage } from '../../pages/ProductCatalogPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { WishlistPage } from '../../pages/WishlistPage';
import { RouteGuard } from '../../routes/RouteGuard';
import { useAuth } from '../auth/AuthContext';
import { WishlistProvider } from './WishlistContext';
import { CartProvider } from '../cart/CartContext';

vi.mock('../auth/AuthContext', () => ({ useAuth: vi.fn() }));

const guestAuth = { status: 'guest' as const, actor: null, current: null, login: vi.fn(), logout: vi.fn(), hasRole: vi.fn(() => false), hasPermission: vi.fn() };
const customerAuth = { ...guestAuth, status: 'authenticated' as const, actor: { id: 'customer-1', email: 'customer@example.com', fullName: 'Customer', roles: ['CUSTOMER'] as Array<'CUSTOMER'>, isEmailVerified: true }, hasRole: vi.fn((role) => role === 'CUSTOMER') };
const unverifiedAuth = { ...customerAuth, actor: { ...customerAuth.actor, id: 'customer-2', isEmailVerified: false } };

function renderFlow(entry = '/products') {
  return render(<MemoryRouter initialEntries={[entry]}><WishlistProvider><CartProvider><Link className="sr-only" to="/wishlist">Mở Wishlist test</Link><Routes><Route path="/products" element={<ProductCatalogPage />} /><Route path="/products/:slug" element={<ProductDetailPage />} /><Route path="/wishlist" element={<RouteGuard area="customer"><WishlistPage /></RouteGuard>} /><Route path="/login" element={<p>Trang đăng nhập</p>} /></Routes></CartProvider></WishlistProvider></MemoryRouter>);
}

describe('Wishlist V1 frontend foundation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue(guestAuth);
  });

  it('does not fake-save for guests and offers login with safe return routing', async () => {
    renderFlow('/products/oat-milk-original');
    await userEvent.click(screen.getByRole('button', { name: 'Thêm Sữa yến mạch nguyên bản vào yêu thích' }));
    const dialog = screen.getByRole('dialog', { name: 'Đăng nhập để lưu sản phẩm yêu thích.' });
    expect(within(dialog).getByText(/không được lưu giả/)).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Đăng nhập' }));
    expect(await screen.findByText('Trang đăng nhập')).toBeInTheDocument();
  });

  it('lets an authenticated Customer add once, expose pressed state, then remove', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow('/products/oat-milk-original');
    const add = screen.getByRole('button', { name: 'Thêm Sữa yến mạch nguyên bản vào yêu thích' });
    expect(add).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(add);
    const remove = screen.getByRole('button', { name: 'Xóa Sữa yến mạch nguyên bản khỏi yêu thích' });
    expect(remove).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(remove);
    expect(screen.getByRole('button', { name: 'Thêm Sữa yến mạch nguyên bản vào yêu thích' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('allows an unverified Customer to use Wishlist', async () => {
    vi.mocked(useAuth).mockReturnValue(unverifiedAuth);
    renderFlow('/products/oat-milk-original');
    await userEvent.click(screen.getByRole('button', { name: 'Thêm Sữa yến mạch nguyên bản vào yêu thích' }));
    expect(screen.getByRole('button', { name: 'Xóa Sữa yến mạch nguyên bản khỏi yêu thích' })).toBeInTheDocument();
  });

  it('renders the protected empty Wishlist page and discovery CTA', () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow('/wishlist');
    expect(screen.getByRole('heading', { level: 1, name: 'Sản phẩm yêu thích' })).toBeInTheDocument();
    expect(screen.getByText('Bạn chưa có sản phẩm yêu thích.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Khám phá sản phẩm' })).toHaveAttribute('href', '/products');
  });

  it('integrates accessible Wishlist actions into every Catalog ProductCard', () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow();
    expect(screen.getAllByRole('button', { name: /Thêm .* vào yêu thích/ })).toHaveLength(20);
  });

  it('renders out-of-stock products without removing them from Wishlist', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow('/products/coconut-yogurt-mango');
    await userEvent.click(screen.getByRole('button', { name: 'Thêm Sữa chua dừa vị xoài vào yêu thích' }));
    expect(screen.getByRole('button', { name: 'Xóa Sữa chua dừa vị xoài khỏi yêu thích' })).toBeInTheDocument();
  });

  it('shows one saved product on the Wishlist page and removes it without duplicates', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderFlow('/products/oat-milk-original');
    await userEvent.click(screen.getByRole('button', { name: 'Thêm Sữa yến mạch nguyên bản vào yêu thích' }));
    await userEvent.click(screen.getByRole('link', { name: 'Mở Wishlist test' }));
    expect(screen.getByText('1 sản phẩm')).toBeInTheDocument();
    expect(screen.getAllByText('Sữa yến mạch nguyên bản')).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: 'Xóa Sữa yến mạch nguyên bản khỏi yêu thích' }));
    expect(screen.getByText('Bạn chưa có sản phẩm yêu thích.')).toBeInTheDocument();
  });

  it('redirects a guest opening /wishlist through the existing guard', () => {
    renderFlow('/wishlist');
    expect(screen.getByText('Trang đăng nhập')).toBeInTheDocument();
  });
});
