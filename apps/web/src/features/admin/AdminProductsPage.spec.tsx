import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminProductsPage } from '../../pages/AdminProductsPage';
import { useAuth } from '../auth/AuthContext';
import { adminApi } from './adminApi';

vi.mock('../auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('./adminApi', () => ({
  adminApi: {
    products: {
      list: vi.fn(),
      options: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const options = {
  categories: [{ id: '1', name: 'Sữa hạt', slug: 'sua-hat', visibility: 'public' as const }],
  brands: [{ id: '2', name: 'HealthyHub', slug: 'healthyhub' }],
  dietaryTags: [],
  media: [],
};
const item = {
  id: '10',
  sku: 'HH-0010',
  name: 'Sữa hạt quản trị',
  slug: 'sua-hat-quan-tri',
  price: '69000.00',
  productStatus: 'active' as const,
  visibility: 'public' as const,
  sellableStatus: 'sellable' as const,
  availability: 'in_stock' as const,
  featured: true,
  brand: options.brands[0],
  primaryCategory: options.categories[0],
  updatedAt: '2026-08-26T00:00:00.000Z',
  version: 3,
};
const page = { items: [item], page: 1, pageSize: 20, totalItems: 21, totalPages: 2 };

function renderPage(entry = '/admin/products') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/products/new" element={<p>Form tạo mới</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Admin Product list', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      status: 'authenticated',
      actor: null,
      current: null,
      login: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(() => true),
      hasPermission: vi.fn(() => true),
    });
    vi.mocked(adminApi.products.options).mockResolvedValue(options);
    vi.mocked(adminApi.products.list).mockResolvedValue(page);
    vi.mocked(adminApi.products.updateStatus).mockResolvedValue({ product: {} as never });
    vi.mocked(adminApi.products.delete).mockResolvedValue({ productId: '10', deleted: true });
  });

  it('renders loading then authoritative data and executable navigation', async () => {
    let resolveList!: (value: typeof page) => void;
    vi.mocked(adminApi.products.list).mockReturnValue(
      new Promise((resolve) => {
        resolveList = resolve;
      }),
    );
    renderPage();
    expect(screen.getByRole('status', { name: 'Đang tải sản phẩm quản trị' })).toBeInTheDocument();
    resolveList(page);
    expect(await screen.findByText('Sữa hạt quản trị')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Tạo sản phẩm' })).toHaveAttribute(
      'href',
      '/admin/products/new',
    );
    expect(screen.getByText((content) => content.includes('69.000'))).toBeInTheDocument();
  });

  it('sends search, filters, sort and pagination through the typed API query', async () => {
    renderPage();
    await screen.findByText('Sữa hạt quản trị');
    await userEvent.type(screen.getByLabelText('Tìm sản phẩm quản trị'), 'milk');
    await userEvent.click(screen.getByRole('button', { name: 'Tìm kiếm' }));
    await waitFor(() =>
      expect(adminApi.products.list).toHaveBeenLastCalledWith(
        expect.objectContaining({ q: 'milk' }),
        expect.any(AbortSignal),
      ),
    );
    await userEvent.selectOptions(screen.getByLabelText('Trạng thái'), 'active');
    await waitFor(() =>
      expect(adminApi.products.list).toHaveBeenLastCalledWith(
        expect.objectContaining({ productStatus: 'active' }),
        expect.any(AbortSignal),
      ),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Trang 2' }));
    await waitFor(() =>
      expect(adminApi.products.list).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 }),
        expect.any(AbortSignal),
      ),
    );
  });

  it('runs lifecycle and soft-delete mutations then refreshes authoritative data', async () => {
    renderPage();
    await screen.findByText('Sữa hạt quản trị');
    await userEvent.click(screen.getByRole('button', { name: 'Ẩn' }));
    await waitFor(() =>
      expect(adminApi.products.updateStatus).toHaveBeenCalledWith('10', {
        productStatus: 'active',
        visibility: 'hidden',
        version: 3,
      }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Xóa' }));
    expect(screen.getByRole('dialog', { name: 'Xóa mềm sản phẩm' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Xóa sản phẩm' }));
    await waitFor(() => expect(adminApi.products.delete).toHaveBeenCalledWith('10', 3));
  });

  it('renders error/retry and empty states without fake rows', async () => {
    vi.mocked(adminApi.products.list)
      .mockRejectedValueOnce({ message: 'Không thể tải.' })
      .mockResolvedValueOnce({ ...page, items: [], totalItems: 0, totalPages: 0 });
    renderPage();
    expect(await screen.findByText('Không tải được danh sách sản phẩm')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
    expect(await screen.findByText('Không có sản phẩm phù hợp')).toBeInTheDocument();
  });
});
