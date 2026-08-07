import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return <main className="auth-page"><section className="auth-card"><p className="auth-brand">HealthyHub</p><h1>Không có quyền truy cập</h1><p className="auth-description">Tài khoản của bạn không có quyền mở nội dung này.</p><Link className="auth-submit text-center" to="/">Về trang chính</Link></section></main>;
}
