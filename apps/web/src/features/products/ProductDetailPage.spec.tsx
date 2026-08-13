import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '../auth/AuthContext';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { PublicLayout } from '../../shared/layouts/PublicLayout';
import { WishlistProvider } from '../wishlist/WishlistContext';
import { CartProvider } from '../cart/CartContext';

vi.mock('../auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../wishlist/wishlistApi', () => ({
  wishlistApi: {
    get: vi.fn().mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 60,
      totalItems: 0,
      totalPages: 0,
    }),
    add: vi.fn(),
    remove: vi.fn(),
  },
}));

const guestAuth = {
  status: 'guest' as const,
  actor: null,
  current: null,
  login: vi.fn(),
  logout: vi.fn(),
  hasRole: vi.fn(),
  hasPermission: vi.fn(),
};

function renderDetail(slug = 'oat-milk-original', node = <ProductDetailPage />) {
  return render(
    <MemoryRouter initialEntries={[`/products/${slug}`]}>
      <WishlistProvider>
        <CartProvider>
          <Routes>
            <Route path="/products/:slug" element={node} />
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </MemoryRouter>,
  );
}

describe('Product Detail V1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue(guestAuth);
  });

  it('resolves a valid slug and renders complete product information', () => {
    renderDetail();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Sữa yến mạch nguyên bản' }),
    ).toBeInTheDocument();
    expect(screen.getByText('HealthyHub Select · Sữa hạt')).toBeInTheDocument();
    expect(screen.getByText('Mã sản phẩm: HH-0001')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('69.000'))).toBeInTheDocument();
    expect(screen.getByText('Tình trạng: Còn hàng')).toBeInTheDocument();
  });

  it('renders a Product not-found state for an invalid slug', () => {
    renderDetail('khong-ton-tai');
    expect(screen.getByText('Không tìm thấy sản phẩm')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Về danh sách sản phẩm' })).toHaveAttribute(
      'href',
      '/products',
    );
  });

  it('switches gallery media with accessible thumbnail controls', async () => {
    renderDetail();
    const ingredientMedia = screen.getByRole('button', {
      name: 'Xem Thông tin thành phần của Sữa yến mạch nguyên bản',
    });
    expect(ingredientMedia).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(ingredientMedia);
    expect(ingredientMedia).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('img', { name: 'Thông tin thành phần của Sữa yến mạch nguyên bản' }),
    ).toBeInTheDocument();
  });

  it('renders nutrition, ingredients and dietary tags from typed data', () => {
    renderDetail();
    const nutrition = screen.getByRole('table', {
      name: 'Thông tin dinh dưỡng của Sữa yến mạch nguyên bản',
    });
    expect(within(nutrition).getByText('120 kcal')).toBeInTheDocument();
    expect(within(nutrition).getByText('3 g')).toBeInTheDocument();
    expect(screen.getByText('Thuần chay')).toBeInTheDocument();
    expect(screen.getByText('Không lactose')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Có chứa yến mạch. Thông tin dị ứng chính thức cần đối chiếu trên nhãn sản phẩm.',
      ),
    ).toBeInTheDocument();
  });

  it('disables commerce actions and quantity when the product is out of stock', () => {
    renderDetail('coconut-yogurt-mango');
    expect(screen.getByText('Tình trạng: Hết hàng')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Thêm Sữa chua dừa vị xoài vào giỏ hàng' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Thêm Sữa chua dừa vị xoài vào yêu thích' }),
    ).toBeEnabled();
    expect(screen.getByLabelText('Số lượng')).toBeDisabled();
    expect(screen.queryByLabelText('Thư viện hình sản phẩm')).not.toBeInTheDocument();
  });

  it('integrates the Customer Cart action for sellable products', async () => {
    renderDetail();
    const addToCart = screen.getByRole('button', {
      name: 'Thêm Sữa yến mạch nguyên bản vào giỏ hàng',
    });
    expect(addToCart).toBeEnabled();
    await userEvent.click(screen.getByRole('button', { name: 'Tăng số lượng' }));
    expect(screen.getByLabelText('Số lượng')).toHaveValue(2);
  });

  it('renders related products using same-category presentation data', () => {
    renderDetail();
    const related = screen.getByRole('heading', { name: 'Sản phẩm liên quan' }).closest('section');
    expect(related).not.toBeNull();
    expect(
      within(related as HTMLElement).getByText('Sữa hạnh nhân không đường'),
    ).toBeInTheDocument();
    expect(
      within(related as HTMLElement).getByRole('link', { name: 'Xem chi tiết Sữa hạt điều cacao' }),
    ).toHaveAttribute('href', '/products/cashew-cocoa-milk');
  });

  it('renders valid breadcrumb links for catalog and category', () => {
    renderDetail();
    const breadcrumb = screen.getByRole('navigation', { name: 'Đường dẫn trang' });
    expect(within(breadcrumb).getByRole('link', { name: 'Sản phẩm' })).toHaveAttribute(
      'href',
      '/products',
    );
    expect(within(breadcrumb).getByRole('link', { name: 'Sữa hạt' })).toHaveAttribute(
      'href',
      '/products?category=plant-milk',
    );
    expect(within(breadcrumb).getByText('Sữa yến mạch nguyên bản')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('renders loading and error foundations', async () => {
    const retry = vi.fn();
    const { rerender } = render(
      <MemoryRouter initialEntries={['/products/oat-milk-original']}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetailPage status="loading" />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('status', { name: 'Đang tải chi tiết sản phẩm' })).toBeInTheDocument();
    rerender(
      <MemoryRouter initialEntries={['/products/oat-milk-original']}>
        <Routes>
          <Route
            path="/products/:slug"
            element={<ProductDetailPage status="error" onRetry={retry} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it.each([
    ['guest', guestAuth],
    [
      'customer',
      {
        ...guestAuth,
        status: 'authenticated' as const,
        actor: {
          id: '1',
          email: 'customer@example.com',
          fullName: 'Customer',
          roles: ['CUSTOMER'] as Array<'CUSTOMER'>,
          isEmailVerified: true,
        },
      },
    ],
    [
      'unverified customer',
      {
        ...guestAuth,
        status: 'authenticated' as const,
        actor: {
          id: '2',
          email: 'pending@example.com',
          fullName: 'Pending',
          roles: ['CUSTOMER'] as Array<'CUSTOMER'>,
          isEmailVerified: false,
        },
      },
    ],
  ])('renders the public detail for %s state', (_label, auth) => {
    vi.mocked(useAuth).mockReturnValue(auth);
    render(
      <MemoryRouter initialEntries={['/products/oat-milk-original']}>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/products/:slug" element={<ProductDetailPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Sữa yến mạch nguyên bản' }),
    ).toBeInTheDocument();
  });
});
