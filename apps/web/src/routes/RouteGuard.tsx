import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { LoadingState } from '../components/foundation/LoadingState';
import { useAuth } from '../features/auth/AuthContext';

interface RouteGuardProps {
  area: 'public' | 'customer' | 'admin';
  children: ReactNode;
}

export function RouteGuard({ area, children }: RouteGuardProps) {
  const auth = useAuth();
  const location = useLocation();
  if (area === 'public') return <>{children}</>;
  if (auth.status === 'restoring') return <LoadingState label="Đang khôi phục phiên đăng nhập…" />;
  if (auth.status === 'guest')
    return (
      <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
    );
  if (area === 'admin' && !(['STAFF', 'MANAGER', 'ADMINISTRATOR'] as const).some(auth.hasRole))
    return <Navigate to="/403" replace />;
  if (area === 'customer' && !auth.hasRole('CUSTOMER')) return <Navigate to="/403" replace />;
  return <>{children}</>;
}

export function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const auth = useAuth();
  if (auth.status === 'restoring') return <LoadingState label="Đang kiểm tra phiên đăng nhập…" />;
  if (auth.status === 'authenticated') {
    const destination = auth.actor?.roles.some((role) => role !== 'CUSTOMER')
      ? '/admin'
      : '/customer';
    return <Navigate to={destination} replace />;
  }
  return <>{children}</>;
}
