import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { ProductSearch } from './ProductSearch';
import { getProductSearchSuggestions, normalizeSearchQuery } from './search.utils';

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="URL hiện tại">{`${location.pathname}${location.search}`}</output>;
}

function SearchHarness({ onSubmit }: { onSubmit?(query: string): void }) {
  const [value, setValue] = useState('');
  return <><ProductSearch value={value} onValueChange={setValue} onSubmit={onSubmit} showEmptyError /><LocationProbe /></>;
}

function renderSearch(onSubmit?: (query: string) => void) {
  return render(<MemoryRouter initialEntries={['/']}><Routes><Route path="*" element={<SearchHarness onSubmit={onSubmit} />} /></Routes></MemoryRouter>);
}

describe('Product Search discovery', () => {
  it('normalizes whitespace without removing Vietnamese accents', () => {
    expect(normalizeSearchQuery('  Sữa   hạt\n Việt  ')).toBe('Sữa hạt Việt');
    expect(getProductSearchSuggestions('SỮA HẠNH NHÂN').some((item) => item.label === 'Sữa hạnh nhân không đường')).toBe(true);
  });

  it('limits discovery and search suggestions to eight', () => {
    expect(getProductSearchSuggestions('')).toHaveLength(7);
    expect(getProductSearchSuggestions('sữa').length).toBeLessThanOrEqual(8);
  });

  it('submits a normalized text query and validates an empty query', async () => {
    const onSubmit = vi.fn();
    renderSearch(onSubmit);
    await userEvent.click(screen.getByRole('button', { name: 'Tìm kiếm' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Hãy nhập tên sản phẩm');
    await userEvent.type(screen.getByRole('combobox', { name: 'Tìm kiếm sản phẩm' }), '  sữa   hạt  ');
    await userEvent.click(screen.getByRole('button', { name: 'Tìm kiếm' }));
    expect(onSubmit).toHaveBeenCalledWith('sữa hạt');
  });

  it('navigates a product suggestion to its detail route', async () => {
    renderSearch();
    const input = screen.getByRole('combobox', { name: 'Tìm kiếm sản phẩm' });
    await userEvent.type(input, 'hạnh nhân');
    await userEvent.click(screen.getByRole('button', { name: /Sữa hạnh nhân không đường/ }));
    expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('/products/almond-milk-unsweetened');
  });

  it('offers category, brand and dietary filter destinations', () => {
    expect(getProductSearchSuggestions('Sữa hạt').some((item) => item.href === '/products?category=plant-milk')).toBe(true);
    expect(getProductSearchSuggestions('Mộc Nhiên').some((item) => item.href === '/products?brand=moc-nhien')).toBe(true);
    expect(getProductSearchSuggestions('Không lactose').some((item) => item.href === '/products?dietary=lactose-free')).toBe(true);
  });

  it('supports ArrowDown, ArrowUp, Enter and Escape', async () => {
    renderSearch();
    const input = screen.getByRole('combobox', { name: 'Tìm kiếm sản phẩm' });
    await userEvent.type(input, 'hạnh nhân');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant');
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(screen.getByLabelText('URL hiện tại')).toHaveTextContent('/products/almond-milk-unsweetened');
  });

  it('clears the controlled value and restores discovery suggestions', async () => {
    renderSearch();
    const input = screen.getByRole('combobox', { name: 'Tìm kiếm sản phẩm' });
    await userEvent.type(input, 'sữa');
    await userEvent.click(screen.getByRole('button', { name: 'Xóa nội dung tìm kiếm' }));
    expect(input).toHaveValue('');
    expect(screen.getByText('Khám phá')).toBeInTheDocument();
  });
});
