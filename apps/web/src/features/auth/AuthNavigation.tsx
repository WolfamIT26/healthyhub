import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from './AuthContext';

export function AuthNavigation({ onNavigate }: { onNavigate?: () => void } = {}) {
  const auth = useAuth();
  const navigate = useNavigate();
  if (auth.status === 'restoring') return null;
  if (auth.status === 'guest')
    return (
      <div className="flex flex-wrap gap-2">
        <Link
          className="inline-flex min-h-11 items-center rounded-control px-3 font-semibold hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          to="/login"
          onClick={onNavigate}
        >
          Đăng nhập
        </Link>
        <Link
          className="inline-flex min-h-11 items-center rounded-control bg-primary px-3 font-semibold text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          to="/register"
          onClick={onNavigate}
        >
          Đăng ký
        </Link>
      </div>
    );
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="hidden sm:inline">{auth.actor?.fullName}</span>
      {auth.hasRole('CUSTOMER') ? (
        <>
          <Link
            className="inline-flex min-h-11 items-center rounded-control px-3 font-semibold hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            to="/account/profile"
            onClick={onNavigate}
          >
            Tài khoản
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-control px-3 font-semibold hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            to="/orders"
            onClick={onNavigate}
          >
            Đơn hàng
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-control px-3 font-semibold hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            to="/wishlist"
            onClick={onNavigate}
          >
            Yêu thích
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-control px-3 font-semibold hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            to="/cart"
            onClick={onNavigate}
          >
            Giỏ hàng
          </Link>
        </>
      ) : null}
      <button
        type="button"
        className="min-h-11 rounded-control px-3 font-semibold hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => {
          void auth.logout().then(() => {
            onNavigate?.();
            navigate('/login', { replace: true });
          });
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}
