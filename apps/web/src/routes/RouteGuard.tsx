import type { ReactNode } from 'react';

interface RouteGuardProps {
  area: 'public' | 'customer' | 'admin';
  children: ReactNode;
}

export function RouteGuard({ area, children }: RouteGuardProps) {
  return <div data-route-area={area}>{children}</div>;
}
