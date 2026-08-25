import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { Avatar, Badge, Button, IconButton } from '../../components';
import { ErrorBoundary } from '../../components/foundation/ErrorBoundary';
import { useAuth } from '../../features/auth/AuthContext';

const adminNavigation = [
  { label: 'Dashboard', description: 'Tổng quan vận hành', to: '/admin', enabled: true, icon: '⌂' },
  { label: 'Sản phẩm', description: 'Chưa triển khai', enabled: false, icon: '□' },
  { label: 'Tồn kho', description: 'Chưa triển khai', enabled: false, icon: '▦' },
  { label: 'Đơn hàng', description: 'Chưa triển khai', enabled: false, icon: '≡' },
  { label: 'Đánh giá', description: 'Chờ policy moderation', enabled: false, icon: '★' },
] as const;

export function AdminLayout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await auth.logout();
    } finally {
      setMenuOpen(false);
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-neutral-950/40 lg:hidden"
          aria-label="Đóng điều hướng quản trị"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-[286px] flex-col border-r border-white/10 bg-neutral-950 text-white shadow-overlay transition-transform duration-standard lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <NavLink
            to="/admin"
            className="flex min-h-11 items-center gap-3 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            onClick={() => setMenuOpen(false)}
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-black">
              H
            </span>
            <span>
              <strong className="block text-base">HealthyHub</strong>
              <span className="text-xs text-neutral-400">Admin workspace</span>
            </span>
          </NavLink>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
            Điều hướng
          </p>
          <nav aria-label="Điều hướng quản trị" className="mt-3 space-y-1">
            {adminNavigation.map((item) =>
              item.enabled ? (
                <NavLink
                  key={item.label}
                  end
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center gap-3 rounded-control px-3 py-2 text-sm transition-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${isActive ? 'bg-white text-neutral-950' : 'text-neutral-300 hover:bg-white/10 hover:text-white'}`
                  }
                >
                  <span className="w-5 text-center text-lg" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="font-semibold">{item.label}</span>
                </NavLink>
              ) : (
                <div
                  key={item.label}
                  aria-disabled="true"
                  className="flex min-h-12 cursor-not-allowed items-center gap-3 rounded-control px-3 py-2 text-sm text-neutral-600"
                  title={item.description}
                >
                  <span className="w-5 text-center text-lg" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{item.label}</span>
                    <span className="block truncate text-[11px]">{item.description}</span>
                  </span>
                </div>
              ),
            )}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <NavLink
            to="/"
            className="flex min-h-11 items-center justify-center rounded-control border border-white/15 px-3 text-sm font-semibold text-neutral-200 transition-standard hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Xem cửa hàng
          </NavLink>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[286px]">
        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <IconButton
                label="Mở điều hướng quản trị"
                aria-controls="admin-sidebar"
                aria-expanded={menuOpen}
                className="lg:hidden"
                onClick={() => setMenuOpen(true)}
              >
                <span aria-hidden="true">☰</span>
              </IconButton>
              <div>
                <p className="text-sm font-bold text-neutral-950">Khu vực quản trị</p>
                <p className="hidden text-xs text-neutral-500 sm:block">Dữ liệu vận hành nội bộ</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 sm:flex">
                <Avatar name={auth.actor?.fullName ?? 'Admin'} size="sm" />
                <div className="max-w-44">
                  <p className="truncate text-sm font-semibold text-neutral-950">
                    {auth.actor?.fullName}
                  </p>
                  <Badge tone="primary">{adminRoleLabel(auth.actor?.roles ?? [])}</Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                loading={loggingOut}
                loadingLabel="Đang thoát…"
                onClick={() => void logout()}
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </header>

        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}

function adminRoleLabel(roles: string[]) {
  if (roles.includes('ADMINISTRATOR')) return 'Administrator';
  if (roles.includes('MANAGER')) return 'Manager';
  return 'Staff';
}
