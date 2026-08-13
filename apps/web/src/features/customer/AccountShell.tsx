import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { Breadcrumb } from '../../components';

export function AccountShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 bg-neutral-50">
      <div className="container py-8 sm:py-10">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tài khoản của tôi' }]} />
        <div className="mb-8 mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            My Account
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">{description}</p>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <nav
            aria-label="Điều hướng tài khoản"
            className="flex gap-2 overflow-x-auto rounded-card border border-neutral-200 bg-white p-2 shadow-soft lg:sticky lg:top-6 lg:flex-col"
          >
            <AccountLink to="/account/profile">Hồ sơ cá nhân</AccountLink>
            <AccountLink to="/account/addresses">Địa chỉ nhận hàng</AccountLink>
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}

function AccountLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex min-h-11 shrink-0 items-center rounded-control px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isActive ? 'bg-primary-100 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
        }`
      }
    >
      {children}
    </NavLink>
  );
}
