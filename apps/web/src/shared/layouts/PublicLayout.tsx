import { NavLink, Outlet } from 'react-router-dom';

import { webEnv } from '../../config/env';
import { AuthNavigation } from '../../features/auth/AuthNavigation';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <NavLink to="/" className="text-lg font-bold text-leaf-700">
            {webEnv.appName}
          </NavLink>
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <NavLink className="rounded-md px-3 py-2 hover:bg-slate-100" to="/">
              Trang chính
            </NavLink>
            <NavLink className="rounded-md px-3 py-2 hover:bg-slate-100" to="/customer">
              Khách hàng
            </NavLink>
            <NavLink className="rounded-md px-3 py-2 hover:bg-slate-100" to="/admin">
              Quản trị
            </NavLink>
          </nav>
          <AuthNavigation />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
