import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { webEnv } from '../../config/env';
import { AuthNavigation } from '../../features/auth/AuthNavigation';
import { EmailVerificationBanner } from '../../features/auth/EmailVerificationBanner';
import { ProductSearch } from '../../features/products/ProductSearch';
import { normalizeSearchQuery } from '../../features/products/search.utils';
import logoSymbol from '../../../../../assets/logos/Logo Symbol.png';
import { IconButton } from '../../components';

const publicLinks = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/products', label: 'Sản phẩm' },
  { to: '/ai', label: 'AI hỗ trợ' },
  { to: '/blog', label: 'Blog' },
];

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/products')
      setHeaderSearch(
        normalizeSearchQuery(new URLSearchParams(location.search).get('search') ?? ''),
      );
  }, [location.pathname, location.search]);

  function submitHeaderSearch(search: string) {
    navigate(`/products?search=${encodeURIComponent(search)}`);
  }

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-slate-50 text-slate-950">
      <header className="relative z-50 shrink-0 border-b border-neutral-200 bg-white">
        <div className="container flex min-h-[72px] items-center justify-between gap-3 py-3">
          <NavLink
            to="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-control font-bold text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={logoSymbol}
              alt=""
              className="h-10 w-10 object-contain"
              width="40"
              height="40"
            />
            <span className="text-lg">{webEnv.appName}</span>
          </NavLink>
          <nav
            aria-label="Điều hướng chính"
            className="hidden items-center gap-1 text-sm font-semibold text-neutral-700 lg:flex"
          >
            {publicLinks.map((item) => (
              <NavLink
                key={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center rounded-control px-3 transition-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'bg-primary-50 text-primary-700' : 'hover:bg-neutral-100'}`
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <ProductSearch
            compact
            className="hidden w-72 xl:block"
            value={headerSearch}
            onValueChange={setHeaderSearch}
            onSubmit={submitHeaderSearch}
            label="Tìm kiếm sản phẩm từ header"
            buttonLabel="Tìm"
          />
          <div className="hidden lg:block">
            <AuthNavigation />
          </div>
          <div className="lg:hidden">
            <IconButton
              label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={menuOpen}
              aria-controls="public-mobile-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span className="text-xl" aria-hidden="true">
                {menuOpen ? '×' : '☰'}
              </span>
            </IconButton>
          </div>
        </div>
        {menuOpen ? (
          <div
            id="public-mobile-menu"
            className="absolute left-0 right-0 top-full border-b border-neutral-200 bg-white p-4 shadow-medium lg:hidden"
          >
            <nav aria-label="Điều hướng mobile" className="container flex flex-col gap-1 p-0">
              <ProductSearch
                className="mb-3"
                value={headerSearch}
                onValueChange={setHeaderSearch}
                onSubmit={submitHeaderSearch}
                onNavigate={() => setMenuOpen(false)}
                label="Tìm kiếm sản phẩm từ menu"
                buttonLabel="Tìm"
              />
              {publicLinks.map((item) => (
                <NavLink
                  key={item.to}
                  end={item.end}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center rounded-control px-3 font-semibold ${isActive ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 border-t border-neutral-200 pt-3">
                <AuthNavigation onNavigate={() => setMenuOpen(false)} />
              </div>
            </nav>
          </div>
        ) : null}
      </header>
      <EmailVerificationBanner />
      <Outlet />
      <footer className="bg-neutral-950 py-12 text-neutral-300">
        <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <img src={logoSymbol} alt="" className="h-10 w-10 object-contain" loading="lazy" />
              {webEnv.appName}
            </div>
            <p className="mt-3 text-sm leading-6">
              Nền tảng giúp bạn tìm hiểu và lựa chọn sản phẩm healthy thuận tiện hơn.
            </p>
          </div>
          <FooterGroup
            title="Sản phẩm"
            items={[
              ['Khám phá sản phẩm', '/products'],
              ['Danh mục', '/products'],
              ['Khuyến mãi', '/promotions'],
            ]}
          />
          <FooterGroup
            title="Hỗ trợ"
            items={[
              ['AI hỗ trợ', '/ai'],
              ['Đăng nhập', '/login'],
              ['Đăng ký', '/register'],
            ]}
          />
          <FooterGroup
            title="Kiến thức"
            items={[
              ['Blog HealthyHub', '/blog'],
              ['Trang chủ', '/'],
            ]}
          />
          <div>
            <h2 className="font-bold text-white">Liên hệ & chính sách</h2>
            <p className="mt-3 text-sm leading-6">
              Thông tin liên hệ và chính sách chính thức sẽ được hiển thị từ cấu hình storefront khi
              module tương ứng sẵn sàng.
            </p>
          </div>
        </div>
        <div className="container mt-10 border-t border-neutral-800 pt-6 text-sm">
          © {new Date().getFullYear()} HealthyHub. Thông tin trên nền tảng không thay thế tư vấn
          chuyên môn.
        </div>
      </footer>
    </div>
  );
}

function FooterGroup({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <div>
      <h2 className="font-bold text-white">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map(([label, to]) => (
          <li key={`${label}-${to}`}>
            <NavLink
              to={to}
              className="inline-flex min-h-11 items-center hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
