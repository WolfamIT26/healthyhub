import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '../auth/AuthContext';
import { HomePage } from '../../pages/HomePage';
import { PublicLayout } from '../../shared/layouts/PublicLayout';

vi.mock('../auth/AuthContext', () => ({ useAuth: vi.fn() }));

const guestAuth = {
  status: 'guest' as const,
  actor: null,
  current: null,
  login: vi.fn(),
  logout: vi.fn(),
  hasRole: vi.fn(),
  hasPermission: vi.fn(),
};

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

function renderPublicLayout() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<p>Nội dung trang chủ</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('Homepage V1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue(guestAuth);
  });

  it('renders the hero CTA, featured products and AI preview', () => {
    renderHome();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Chọn điều lành mạnh, theo cách dễ dàng hơn' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Khám phá sản phẩm' })).toHaveAttribute(
      'href',
      '/products',
    );
    expect(screen.getByRole('link', { name: 'Khám phá AI' })).toHaveAttribute('href', '/ai');
    expect(screen.getByText('Sữa yến mạch nguyên bản')).toBeInTheDocument();
    expect(screen.getByText('AI Product Finder')).toBeInTheDocument();
    expect(screen.getAllByText(/dữ liệu trình bày/i).length).toBeGreaterThan(0);
  });

  it('validates an empty product search and navigates a normalized keyword', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<p>Kết quả sản phẩm</p>} />
        </Routes>
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Tìm kiếm' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Hãy nhập tên sản phẩm');
    await userEvent.type(
      screen.getByRole('combobox', { name: 'Tìm kiếm sản phẩm từ trang chủ' }),
      '  sữa hạt  ',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Tìm kiếm' }));
    expect(screen.getByText('Kết quả sản phẩm')).toBeInTheDocument();
  });

  it('shows accessible mobile navigation and guest controls', async () => {
    renderPublicLayout();
    const header = screen.getByRole('banner');
    expect(within(header).getByRole('link', { name: 'Đăng nhập' })).toBeInTheDocument();
    const menuButton = screen.getByRole('button', { name: 'Mở menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(menuButton);
    expect(screen.getByRole('navigation', { name: 'Điều hướng mobile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Đóng menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('searches from the mobile header and closes the menu', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<p>Nội dung trang chủ</p>} />
            <Route path="products" element={<p>Trang catalog search</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Mở menu' }));
    const mobileNavigation = screen.getByRole('navigation', { name: 'Điều hướng mobile' });
    await userEvent.type(
      within(mobileNavigation).getByRole('combobox', { name: 'Tìm kiếm sản phẩm từ menu' }),
      '  granola  ',
    );
    await userEvent.click(within(mobileNavigation).getByRole('button', { name: 'Tìm' }));
    expect(await screen.findByText('Trang catalog search')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Điều hướng mobile' })).not.toBeInTheDocument();
  });

  it('reflects authenticated state and keeps the unverified Customer banner', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...guestAuth,
      status: 'authenticated',
      actor: {
        id: 'customer-1',
        email: 'pending@example.com',
        fullName: 'Khách Healthy',
        roles: ['CUSTOMER'],
        isEmailVerified: false,
      },
    });
    renderPublicLayout();
    const header = screen.getByRole('banner');
    expect(within(header).getByText('Khách Healthy')).toBeInTheDocument();
    expect(screen.getByLabelText('Trạng thái xác minh email')).toBeInTheDocument();
    expect(within(header).queryByRole('link', { name: 'Đăng ký' })).not.toBeInTheDocument();
  });
});
