import { NavLink, Outlet } from 'react-router-dom';

import { webEnv } from '../../config/env';
import { AuthNavigation } from '../../features/auth/AuthNavigation';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-slate-50 text-slate-950">
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4">
          <NavLink to="/" className="text-lg font-bold text-leaf-700">
            {webEnv.appName}
          </NavLink>
          <nav className="order-3 flex w-full flex-wrap items-center gap-1 text-sm font-medium text-slate-700 sm:order-none sm:w-auto sm:gap-2">
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
