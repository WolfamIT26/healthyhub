import { Link } from 'react-router-dom';
import { AuthCard } from '../features/auth/AuthCard';

export function ForbiddenPage() {
  return (
    <AuthCard
      title="Không có quyền truy cập"
      description="Tài khoản của bạn không có quyền mở nội dung này."
    >
      <Link
        className="inline-flex min-h-11 w-full items-center justify-center rounded-control bg-primary px-4 py-2.5 text-center font-semibold text-white transition-standard hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        to="/"
      >
        Về trang chính
      </Link>
    </AuthCard>
  );
}
