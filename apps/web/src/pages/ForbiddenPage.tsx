import { Link } from 'react-router-dom';
import { AuthCard } from '../features/auth/AuthCard';

export function ForbiddenPage() {
  return <AuthCard title="Không có quyền truy cập" description="Tài khoản của bạn không có quyền mở nội dung này."><Link className="auth-submit text-center" to="/">Về trang chính</Link></AuthCard>;
}
