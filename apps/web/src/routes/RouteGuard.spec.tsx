import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GuestOnlyRoute, RouteGuard } from './RouteGuard';
import { useAuth } from '../features/auth/AuthContext';

vi.mock('../features/auth/AuthContext', () => ({ useAuth: vi.fn() }));

const baseAuth = {
  actor: null,
  current: null,
  login: vi.fn(),
  logout: vi.fn(),
  hasRole: vi.fn(),
  hasPermission: vi.fn(),
};

describe('Authentication route guards', () => {
  beforeEach(() => vi.clearAllMocks());

  it('redirects a guest away from a protected route', () => {
    vi.mocked(useAuth).mockReturnValue({ ...baseAuth, status: 'guest' });
    render(
      <MemoryRouter initialEntries={['/customer']}>
        <Routes>
          <Route
            path="/customer"
            element={
              <RouteGuard area="customer">
                <p>Protected</p>
              </RouteGuard>
            }
          />
          <Route path="/login" element={<p>Login route</p>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Login route')).toBeInTheDocument();
  });

  it('redirects an authenticated user away from guest-only routes', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...baseAuth,
      status: 'authenticated',
      actor: {
        id: '1',
        email: 'a@b.com',
        fullName: 'A',
        roles: ['CUSTOMER'],
        isEmailVerified: true,
      },
    });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <p>Login</p>
              </GuestOnlyRoute>
            }
          />
          <Route path="/customer" element={<p>Customer route</p>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Customer route')).toBeInTheDocument();
  });

  it('redirects an authenticated actor without an admin role to forbidden', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...baseAuth,
      status: 'authenticated',
      hasRole: vi.fn(() => false),
    });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <RouteGuard area="admin">
                <p>Admin</p>
              </RouteGuard>
            }
          />
          <Route path="/403" element={<p>Forbidden route</p>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Forbidden route')).toBeInTheDocument();
  });

  it('redirects a guest away from a direct Customer Orders URL', () => {
    vi.mocked(useAuth).mockReturnValue({ ...baseAuth, status: 'guest' });
    render(
      <MemoryRouter initialEntries={['/orders/42']}>
        <Routes>
          <Route
            path="/orders/:orderId"
            element={
              <RouteGuard area="customer">
                <p>Order detail</p>
              </RouteGuard>
            }
          />
          <Route path="/login" element={<p>Orders login route</p>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Orders login route')).toBeInTheDocument();
  });

  it('redirects an internal actor away from Customer Orders', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...baseAuth,
      status: 'authenticated',
      hasRole: vi.fn(() => false),
    });
    render(
      <MemoryRouter initialEntries={['/orders']}>
        <Routes>
          <Route
            path="/orders"
            element={
              <RouteGuard area="customer">
                <p>Orders</p>
              </RouteGuard>
            }
          />
          <Route path="/403" element={<p>Orders forbidden route</p>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Orders forbidden route')).toBeInTheDocument();
  });
});
