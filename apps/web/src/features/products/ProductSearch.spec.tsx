import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { catalogProducts, productBrands, productCategories } from './catalog.data';
import { ProductSearch } from './ProductSearch';
import { productApi, type ProductOptions } from './productApi';
import { buildProductSearchSuggestions, normalizeSearchQuery } from './search.utils';

vi.mock('./productApi', () => ({
  productApi: {
    list: vi.fn(),
    detail: vi.fn(),
    options: vi.fn(),
  },
}));

const productOptions: ProductOptions = {
  categories: productCategories.map((item) => ({ ...item, slug: item.id })),
  brands: productBrands.map((item) => ({ ...item, slug: item.id })),
  dietary: [
    'low-sugar',
    'sugar-free',
    'high-protein',
    'vegan',
    'vegetarian',
    'lactose-free',
    'gluten-free',
    'organic',
  ],
};

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="URL hiện tại">{`${location.pathname}${location.search}`}</output>;
}

function SearchHarness({ onSubmit }: { onSubmit?(query: string): void }) {
  const [value, setValue] = useState('');
  return (
    <>
      <ProductSearch value={value} onValueChange={setValue} onSubmit={onSubmit} showEmptyError />
      <LocationProbe />
    </>
  );
}

function renderSearch(onSubmit?: (query: string) => void) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="*" element={<SearchHarness onSubmit={onSubmit} />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Product Search discovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(productApi.options).mockResolvedValue(productOptions);
    vi.mocked(productApi.list).mockImplementation(async (query) => {
      const keyword = normalizeSearchQuery(query.search).toLocaleLowerCase('vi-VN');
      const items = catalogProducts
        .filter((product) =>
          `${product.name} ${product.category.name} ${product.brand.name}`
            .toLocaleLowerCase('vi-VN')
            .includes(keyword),
        )
        .slice(0, query.limit);
      return {
        items,
        page: 1,
        pageSize: query.limit,
        totalItems: items.length,
        totalPages: 1,
      };
    });
  });

  it('normalizes whitespace without removing Vietnamese accents', () => {
    expect(normalizeSearchQuery('  Sữa   hạt\n Việt  ')).toBe('Sữa hạt Việt');
    expect(
      buildProductSearchSuggestions('SỮA HẠNH NHÂN', catalogProducts, productOptions).some(
        (item) => item.label === 'Sữa hạnh nhân không đường',
      ),
    ).toBe(true);
  });

  it('limits discovery and search suggestions to eight', () => {
    expect(buildProductSearchSuggestions('', [], productOptions)).toHaveLength(7);
    expect(
      buildProductSearchSuggestions('sữa', catalogProducts, productOptions).length,
    ).toBeLessThanOrEqual(8);
  });

  it('submits a normalized text query and validates an empty query', async () => {
    const onSubmit = vi.fn();
    renderSearch(onSubmit);
    await userEvent.click(screen.getByRole('button', { name: 'Tìm kiếm' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Hãy nhập tên sản phẩm');
    await userEvent.type(
      screen.getByRole('combobox', { name: 'Tìm kiếm sản phẩm' }),
      '  sữa   hạt  ',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Tìm kiếm' }));
    expect(onSubmit).toHaveBeenCalledWith('sữa hạt');
  });

  it('navigates a product suggestion to its detail route', async () => {
    renderSearch();
    const input = screen.getByRole('combobox', { name: 'Tìm kiếm sản phẩm' });
    await userEvent.type(input, 'hạnh nhân');
    await userEvent.click(await screen.findByRole('button', { name: /Sữa hạnh nhân không đường/ }));
    expect(productApi.list).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'hạnh nhân', limit: 6 }),
      expect.any(AbortSignal),
    );
    expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent(
      '/products/almond-milk-unsweetened',
    );
  });

  it('debounces discovery and aborts a stale Product request when the query changes', async () => {
    renderSearch();
    const input = screen.getByRole('combobox', { name: 'Tìm kiếm sản phẩm' });
    await userEvent.type(input, 'sữa');
    await waitFor(() => expect(productApi.list).toHaveBeenCalledTimes(1));
    const firstSignal = vi.mocked(productApi.list).mock.calls[0][1];

    await userEvent.clear(input);
    await userEvent.type(input, 'hạnh nhân');
    await waitFor(() => expect(productApi.list).toHaveBeenCalledTimes(2));

    expect(firstSignal?.aborted).toBe(true);
  });

  it('offers category, brand and dietary filter destinations', () => {
    expect(
      buildProductSearchSuggestions('Sữa hạt', [], productOptions).some(
        (item) => item.href === '/products?category=plant-milk',
      ),
    ).toBe(true);
    expect(
      buildProductSearchSuggestions('Mộc Nhiên', [], productOptions).some(
        (item) => item.href === '/products?brand=moc-nhien',
      ),
    ).toBe(true);
    expect(
      buildProductSearchSuggestions('Không lactose', [], productOptions).some(
        (item) => item.href === '/products?dietary=lactose-free',
      ),
    ).toBe(true);
  });

  it('supports ArrowDown, ArrowUp, Enter and Escape', async () => {
    renderSearch();
    const input = screen.getByRole('combobox', { name: 'Tìm kiếm sản phẩm' });
    await userEvent.type(input, 'hạnh nhân');
    await screen.findByRole('button', { name: /Sữa hạnh nhân không đường/ });
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant');
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent(
      '/products/almond-milk-unsweetened',
    );
  });

  it('clears the controlled value and restores discovery suggestions', async () => {
    renderSearch();
    const input = screen.getByRole('combobox', { name: 'Tìm kiếm sản phẩm' });
    await userEvent.type(input, 'sữa');
    await userEvent.click(screen.getByRole('button', { name: 'Xóa nội dung tìm kiếm' }));
    expect(input).toHaveValue('');
    expect(await screen.findByText('Khám phá')).toBeInTheDocument();
  });
});
