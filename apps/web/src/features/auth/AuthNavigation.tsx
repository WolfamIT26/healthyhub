import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from './AuthContext';

export function AuthNavigation() {
  const auth = useAuth();
  const navigate = useNavigate();
  if (auth.status === 'restoring') return null;
  if (auth.status === 'guest') return <div className="flex gap-2"><Link className="rounded-md px-3 py-2 hover:bg-slate-100" to="/login">Đăng nhập</Link><Link className="rounded-md bg-leaf-600 px-3 py-2 text-white" to="/register">Đăng ký</Link></div>;
  return <div className="flex items-center gap-3"><span className="hidden sm:inline">{auth.actor?.fullName}</span><button type="button" className="rounded-md px-3 py-2 hover:bg-slate-100" onClick={() => { void auth.logout().then(() => navigate('/login', { replace: true })); }}>Đăng xuất</button></div>;
}
