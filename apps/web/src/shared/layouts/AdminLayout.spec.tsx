import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '../../features/auth/AuthContext';
import { AdminLayout } from './AdminLayout';

vi.mock('../../features/auth/AuthContext', () => ({ useAuth: vi.fn() }));

const logout = vi.fn().mockResolvedValue(undefined);

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      status: 'authenticated',
      actor: {
        id: '7',
        email: 'admin@example.test',
        fullName: 'Quản trị viên',
        roles: ['ADMINISTRATOR'],
        isEmailVerified: true,
      },
      current: null,
      login: vi.fn(),
      logout,
      hasRole: vi.fn(() => true),
      hasPermission: vi.fn(() => true),
    });
  });

  function renderLayout() {
    return render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<p>Nội dung dashboard</p>} />
          </Route>
          <Route path="/login" element={<p>Trang đăng nhập</p>} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('renders the authorized actor, executable Dashboard and unavailable future modules', () => {
    renderLayout();
    expect(screen.getByText('Nội dung dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Dashboard/ })).toHaveAttribute('href', '/admin');
    expect(screen.getByRole('link', { name: /Sản phẩm/ })).toHaveAttribute(
      'href',
      '/admin/products',
    );
    expect(screen.getByText('Quản trị viên')).toBeInTheDocument();
    for (const label of ['Tồn kho', 'Đơn hàng', 'Đánh giá']) {
      expect(screen.getByText(label).closest('[aria-disabled="true"]')).not.toBeNull();
    }
  });

  it('logs out through the canonical Auth contract and leaves no Admin shell visible', async () => {
    renderLayout();
    await userEvent.click(screen.getByRole('button', { name: 'Đăng xuất' }));
    expect(logout).toHaveBeenCalledOnce();
    expect(await screen.findByText('Trang đăng nhập')).toBeInTheDocument();
    expect(screen.queryByText('Nội dung dashboard')).not.toBeInTheDocument();
  });
});
