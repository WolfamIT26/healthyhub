import { NavLink, Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-200 bg-slate-950 px-4 py-4 text-white lg:border-b-0 lg:border-r">
          <NavLink to="/" className="block text-lg font-bold">
            HealthyHub Admin
          </NavLink>
          <nav className="mt-4 flex flex-wrap gap-2 text-sm lg:flex-col">
            <NavLink className="rounded-md px-3 py-2 hover:bg-white/10" to="/">
              Storefront
            </NavLink>
            <NavLink className="rounded-md bg-white/10 px-3 py-2" to="/admin">
              Dashboard nền
            </NavLink>
          </nav>
        </aside>
        <Outlet />
      </div>
    </div>
  );
}
