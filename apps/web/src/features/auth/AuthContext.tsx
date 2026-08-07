import type { ActorSummary, CurrentSessionResult, RoleName } from '@healthyhub/shared-types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { refreshAccessToken } from '../../services/api/httpClient';
import { authApi } from './authApi';
import { authSessionStore, type AuthSnapshot } from './authSessionStore';

interface AuthContextValue {
  status: 'restoring' | 'authenticated' | 'guest';
  actor: ActorSummary | null;
  current: CurrentSessionResult | null;
  login(email: string, password: string): Promise<ActorSummary>;
  logout(): Promise<void>;
  hasRole(role: RoleName): boolean;
  hasPermission(permission: string): boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<AuthSnapshot>(authSessionStore.getSnapshot());
  const [restoring, setRestoring] = useState(true);

  useEffect(() => authSessionStore.subscribe(setSnapshot), []);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        if (!authSessionStore.getSnapshot().accessToken) await refreshAccessToken();
        const current = await authApi.session();
        if (active) authSessionStore.setCurrent(current);
      } catch {
        if (active) authSessionStore.clear();
      } finally {
        if (active) setRestoring(false);
      }
    }
    void restore();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    authSessionStore.setAccessToken(result.accessToken);
    const current = await authApi.session();
    authSessionStore.setCurrent(current);
    return current.actor;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      authSessionStore.clear();
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: restoring ? 'restoring' : snapshot.current ? 'authenticated' : 'guest',
      actor: snapshot.current?.actor ?? null,
      current: snapshot.current,
      login,
      logout,
      hasRole: (role) => snapshot.current?.actor.roles.includes(role) ?? false,
      hasPermission: (permission) => snapshot.current?.permissions.includes(permission) ?? false,
    }),
    [login, logout, restoring, snapshot],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng bên trong AuthProvider.');
  return context;
}
