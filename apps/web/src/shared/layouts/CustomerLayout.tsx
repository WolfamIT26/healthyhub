import { NavLink, Outlet } from 'react-router-dom';

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-leaf-50 text-slate-950">
      <header className="border-b border-leaf-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <NavLink to="/" className="text-lg font-bold text-leaf-700">
            HealthyHub
          </NavLink>
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <NavLink className="rounded-md px-3 py-2 hover:bg-leaf-50" to="/">
              Trang chính
            </NavLink>
            <NavLink className="rounded-md bg-leaf-100 px-3 py-2 text-leaf-700" to="/customer">
              Khu khách hàng
            </NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
