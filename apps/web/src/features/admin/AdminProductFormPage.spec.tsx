import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminProductFormPage } from '../../pages/AdminProductFormPage';
import { useAuth } from '../auth/AuthContext';
import { adminApi } from './adminApi';

vi.mock('../auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('./adminApi', () => ({
  adminApi: {
    products: {
      options: vi.fn(),
      detail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const options = {
  categories: [{ id: '1', name: 'Sữa hạt', slug: 'sua-hat', visibility: 'public' as const }],
  brands: [{ id: '2', name: 'HealthyHub', slug: 'healthyhub' }],
  dietaryTags: ['vegan' as const],
  media: [
    {
      id: '3',
      name: 'Ảnh sản phẩm',
      visibility: 'public' as const,
      previewUrl: 'https://cdn.example.test/product.webp',
    },
  ],
};
const product = {
  id: '10',
  sku: 'HH-0010',
  name: 'Sữa hạt quản trị',
  slug: 'sua-hat-quan-tri',
  price: '69000.00',
  productStatus: 'draft' as const,
  visibility: 'hidden' as const,
  sellableStatus: 'unavailable' as const,
  availability: 'unavailable' as const,
  featured: false,
  brand: options.brands[0],
  primaryCategory: { ...options.categories[0], primary: true },
  categories: [{ ...options.categories[0], primary: true }],
  content: {
    description: 'Mô tả hợp lệ',
    summary: null,
    usageNote: null,
    storageNote: null,
    seoTitle: null,
    seoDescription: null,
    status: 'published' as const,
  },
  nutrition: null,
  ingredients: [],
  dietaryTags: ['vegan' as const],
  media: [],
  createdAt: '2026-08-26T00:00:00.000Z',
  updatedAt: '2026-08-26T00:00:00.000Z',
  version: 2,
};

function renderPage(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/admin/products/new" element={<AdminProductFormPage />} />
        <Route path="/admin/products/:productId" element={<AdminProductFormPage />} />
        <Route path="/admin/products" element={<p>Danh sách sản phẩm</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Admin Product form', () => {
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
    vi.mocked(adminApi.products.detail).mockResolvedValue(product);
    vi.mocked(adminApi.products.create).mockResolvedValue({ product, created: true });
    vi.mocked(adminApi.products.update).mockResolvedValue({ product: { ...product, version: 3 } });
    vi.mocked(adminApi.products.updateStatus).mockResolvedValue({
      product: { ...product, productStatus: 'active', visibility: 'public', version: 3 },
    });
    vi.mocked(adminApi.products.delete).mockResolvedValue({ productId: '10', deleted: true });
  });

  it('validates and submits a typed create aggregate', async () => {
    renderPage('/admin/products/new');
    expect(await screen.findByRole('heading', { name: 'Tạo sản phẩm' })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/^SKU/), 'HH-NEW');
    await userEvent.type(screen.getByLabelText(/^Tên sản phẩm/), 'Sữa mới');
    await userEvent.type(screen.getByLabelText(/^Slug/), 'sua-moi');
    const price = screen.getByLabelText(/^Giá VND/);
    await userEvent.clear(price);
    await userEvent.type(price, '69000.00');
    await userEvent.click(screen.getByLabelText('Sữa hạt'));
    await userEvent.type(screen.getByLabelText(/^Mô tả/), 'Mô tả sản phẩm hợp lệ');
    await userEvent.click(screen.getByLabelText('Thuần chay'));
    await userEvent.click(screen.getByLabelText('Ảnh sản phẩm (public)'));
    await userEvent.click(screen.getByRole('button', { name: 'Tạo sản phẩm' }));

    await waitFor(() =>
      expect(adminApi.products.create).toHaveBeenCalledWith(
        expect.objectContaining({
          sku: 'HH-NEW',
          slug: 'sua-moi',
          categoryIds: ['1'],
          primaryCategoryId: '1',
          dietaryTags: ['vegan'],
          media: [{ mediaAssetId: '3', role: 'gallery' }],
        }),
      ),
    );
  });

  it('loads an authoritative edit aggregate and saves with current version', async () => {
    renderPage('/admin/products/10');
    expect(await screen.findByDisplayValue('HH-0010')).toHaveAttribute('readonly');
    const name = screen.getByLabelText(/^Tên sản phẩm/);
    await userEvent.clear(name);
    await userEvent.type(name, 'Sữa hạt đã sửa');
    await userEvent.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));
    await waitFor(() =>
      expect(adminApi.products.update).toHaveBeenCalledWith(
        '10',
        expect.objectContaining({ name: 'Sữa hạt đã sửa', version: 2 }),
      ),
    );
    expect(
      await screen.findByText('Đã lưu Product aggregate vào persistence canonical.'),
    ).toBeInTheDocument();
  });

  it('executes lifecycle and soft-delete actions with optimistic version', async () => {
    renderPage('/admin/products/10');
    await screen.findByDisplayValue('HH-0010');
    await userEvent.selectOptions(screen.getByLabelText('Product status'), 'active');
    await userEvent.selectOptions(screen.getByLabelText('Visibility'), 'public');
    await userEvent.click(screen.getByRole('button', { name: 'Cập nhật lifecycle' }));
    await waitFor(() =>
      expect(adminApi.products.updateStatus).toHaveBeenCalledWith('10', {
        productStatus: 'active',
        visibility: 'public',
        version: 2,
      }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Xóa mềm sản phẩm' }));
    await userEvent.click(screen.getByRole('button', { name: 'Xóa sản phẩm' }));
    await waitFor(() => expect(adminApi.products.delete).toHaveBeenCalledWith('10', 3));
  });

  it('renders backend failure and blocks create UI without manage permission', async () => {
    vi.mocked(adminApi.products.update).mockRejectedValueOnce({ message: 'Version conflict.' });
    const { unmount } = renderPage('/admin/products/10');
    await screen.findByDisplayValue('HH-0010');
    await userEvent.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));
    expect(await screen.findByText('Version conflict.')).toBeInTheDocument();
    unmount();

    vi.mocked(useAuth).mockReturnValue({
      status: 'authenticated',
      actor: null,
      current: null,
      login: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(() => true),
      hasPermission: vi.fn(() => false),
    });
    renderPage('/admin/products/new');
    expect(await screen.findByText('Không có quyền tạo sản phẩm')).toBeInTheDocument();
    expect(adminApi.products.create).not.toHaveBeenCalled();
  });
});
