import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '../auth/AuthContext';
import { ProductCatalogPage } from '../../pages/ProductCatalogPage';
import { PublicLayout } from '../../shared/layouts/PublicLayout';

vi.mock('../auth/AuthContext', () => ({ useAuth: vi.fn() }));

const guestAuth = { status: 'guest' as const, actor: null, current: null, login: vi.fn(), logout: vi.fn(), hasRole: vi.fn(), hasPermission: vi.fn() };

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="URL hiện tại">{`${location.pathname}${location.search}`}</output>;
}

function renderCatalog(entry = '/products', node = <ProductCatalogPage />) {
  return render(<MemoryRouter initialEntries={[entry]}><Routes><Route path="/products" element={<>{node}<LocationProbe /></>} /><Route path="/products/:slug" element={<><p>Trang chi tiết foundation</p><LocationProbe /></>} /></Routes></MemoryRouter>);
}

describe('Product Catalog V1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue(guestAuth);
  });

  it('renders products, result summary and pagination', () => {
    renderCatalog();
    expect(screen.getByRole('heading', { level: 1, name: 'Khám phá sản phẩm healthy' })).toBeInTheDocument();
    expect(screen.getByText('24 sản phẩm')).toBeInTheDocument();
    expect(screen.getByText('Sữa yến mạch nguyên bản')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Phân trang sản phẩm' })).toBeInTheDocument();
  });

  it('searches, syncs the URL and clears search', async () => {
    renderCatalog();
    const search = screen.getByRole('combobox', { name: 'Tìm kiếm trong danh mục sản phẩm' });
    await userEvent.type(search, 'sữa hạnh nhân');
    await userEvent.click(screen.getByRole('button', { name: 'Tìm sản phẩm' }));
    await waitFor(() => expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('/products?search=s%E1%BB%AFa+h%E1%BA%A1nh+nh%C3%A2n'));
    expect(screen.getByText('Sữa hạnh nhân không đường')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Xóa nội dung tìm kiếm' }));
    await waitFor(() => expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('/products'));
    expect(screen.getByText('24 sản phẩm')).toBeInTheDocument();
  });

  it('preserves filters and resets page when a new search is submitted', async () => {
    renderCatalog('/products?category=plant-milk&page=2');
    const search = screen.getByRole('combobox', { name: 'Tìm kiếm trong danh mục sản phẩm' });
    await userEvent.type(search, 'sữa');
    await userEvent.click(screen.getByRole('button', { name: 'Tìm sản phẩm' }));
    await waitFor(() => expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('/products?search=s%E1%BB%AFa&category=plant-milk'));
    expect(screen.getByLabelText('URL hiện tại')).not.toHaveTextContent('page=2');
  });

  it('filters by category and dietary tag with URL synchronization', async () => {
    renderCatalog();
    await userEvent.selectOptions(screen.getByLabelText('Danh mục'), 'plant-milk');
    await userEvent.click(screen.getByRole('checkbox', { name: 'Không lactose' }));
    await waitFor(() => expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('category=plant-milk&dietary=lactose-free'));
    expect(screen.getByText('3 sản phẩm')).toBeInTheDocument();
  });

  it('filters by price and can clear every filter', async () => {
    renderCatalog('/products?brand=healthyhub-select');
    const minimum = screen.getByRole('spinbutton', { name: 'Giá tối thiểu' });
    await userEvent.type(minimum, '100000');
    await waitFor(() => expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('minPrice=100000'));
    expect(screen.getByText('2 sản phẩm')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Xóa tất cả' })[0]);
    await waitFor(() => expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('/products'));
    expect(screen.getByText('24 sản phẩm')).toBeInTheDocument();
  });

  it('sorts by price and resets page when sorting changes', async () => {
    renderCatalog('/products?page=2');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sắp xếp sản phẩm' }), 'price-desc');
    await waitFor(() => expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('/products?sort=price-desc'));
    const productLinks = screen.getAllByRole('link', { name: /^Xem chi tiết/ });
    expect(productLinks[0]).toHaveAccessibleName('Xem chi tiết Granola hạt và quả mọng');
  });

  it('changes page and preserves it in the URL', async () => {
    renderCatalog();
    await userEvent.click(screen.getByRole('button', { name: 'Trang 2' }));
    await waitFor(() => expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('/products?page=2'));
    expect(screen.getByRole('button', { name: 'Trang 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('shows an empty state and clears filters', async () => {
    renderCatalog('/products?search=khong-co-san-pham');
    expect(screen.getByText('Không tìm thấy sản phẩm')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Xóa bộ lọc' }));
    expect(await screen.findByText('24 sản phẩm')).toBeInTheDocument();
  });

  it('navigates from a product card by slug', async () => {
    renderCatalog('/products?search=s%E1%BB%AFa+y%E1%BA%BFn+m%E1%BA%A1ch');
    await userEvent.click(screen.getByRole('link', { name: 'Xem chi tiết Sữa yến mạch nguyên bản' }));
    expect(await screen.findByText('Trang chi tiết foundation')).toBeInTheDocument();
    expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('/products/oat-milk-original');
  });

  it('opens the mobile filter drawer and applies a filter', async () => {
    renderCatalog();
    await userEvent.click(screen.getByRole('button', { name: 'Bộ lọc' }));
    const drawer = screen.getByRole('dialog', { name: 'Bộ lọc sản phẩm' });
    await userEvent.selectOptions(within(drawer).getByLabelText('Thương hiệu'), 'moc-nhien');
    await userEvent.click(within(drawer).getByRole('button', { name: 'Áp dụng bộ lọc' }));
    expect(screen.queryByRole('dialog', { name: /Bộ lọc sản phẩm/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('brand=moc-nhien');
  });

  it('renders loading and error states instead of a blank screen', async () => {
    const retry = vi.fn();
    const { rerender } = render(<MemoryRouter><ProductCatalogPage status="loading" /></MemoryRouter>);
    expect(screen.getByRole('status', { name: 'Đang tải sản phẩm' })).toBeInTheDocument();
    rerender(<MemoryRouter><ProductCatalogPage status="error" onRetry={retry} /></MemoryRouter>);
    expect(screen.getByText('Không thể tải danh sách sản phẩm')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it.each([
    ['guest', guestAuth],
    ['customer', { ...guestAuth, status: 'authenticated' as const, actor: { id: '1', email: 'customer@example.com', fullName: 'Customer', roles: ['CUSTOMER'] as Array<'CUSTOMER'>, isEmailVerified: true } }],
  ])('renders the public catalog for %s state', (_label, auth) => {
    vi.mocked(useAuth).mockReturnValue(auth);
    render(<MemoryRouter initialEntries={['/products']}><Routes><Route element={<PublicLayout />}><Route path="/products" element={<ProductCatalogPage />} /></Route></Routes></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Khám phá sản phẩm healthy' })).toBeInTheDocument();
    expect(screen.getByText('24 sản phẩm')).toBeInTheDocument();
  });
});
