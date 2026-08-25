import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  session: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}));
vi.mock('../../services/api/httpClient', () => ({ refreshAccessToken: mocks.refresh }));
vi.mock('./authApi', () => ({
  authApi: { session: mocks.session, login: mocks.login, logout: mocks.logout },
}));

import { AuthProvider, useAuth } from './AuthContext';
import { authSessionStore } from './authSessionStore';

function Probe() {
  const auth = useAuth();
  return (
    <div>
      <p>
        {auth.status}:{auth.actor?.fullName ?? 'none'}
      </p>
      <button type="button" onClick={() => void auth.login('next@example.test', 'password')}>
        Đổi tài khoản
      </button>
    </div>
  );
}

describe('AuthProvider session restore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authSessionStore.clear();
  });

  it('restores access and current session after reload', async () => {
    mocks.refresh.mockImplementation(async () => {
      authSessionStore.setAccessToken('restored-token');
      return 'restored-token';
    });
    mocks.session.mockResolvedValue({
      session: {
        id: 'session',
        status: 'active',
        issuedAt: new Date().toISOString(),
        expiresAt: new Date().toISOString(),
      },
      actor: {
        id: '1',
        email: 'user@example.com',
        fullName: 'Restored User',
        roles: ['CUSTOMER'],
        isEmailVerified: true,
      },
      permissions: [],
      permissionsVersion: 1,
    });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    expect(await screen.findByText('authenticated:Restored User')).toBeInTheDocument();
  });

  it('falls back to guest and clears state when refresh fails', async () => {
    mocks.refresh.mockRejectedValue(new Error('expired'));
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    expect(await screen.findByText('guest:none')).toBeInTheDocument();
    expect(authSessionStore.getSnapshot()).toEqual({ accessToken: null, current: null });
  });

  it('clears the previous actor before an account switch and stores only the new actor', async () => {
    const oldCurrent = {
      session: {
        id: 'old-session',
        status: 'active' as const,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date().toISOString(),
      },
      actor: {
        id: '7',
        email: 'admin@example.test',
        fullName: 'Old Admin',
        roles: ['ADMINISTRATOR'] as const,
        isEmailVerified: true,
      },
      permissions: ['analytics:read'],
      permissionsVersion: 1,
    };
    const newCurrent = {
      ...oldCurrent,
      session: { ...oldCurrent.session, id: 'new-session' },
      actor: {
        ...oldCurrent.actor,
        id: '8',
        email: 'customer@example.test',
        fullName: 'New Customer',
        roles: ['CUSTOMER'] as const,
      },
      permissions: [],
    };
    authSessionStore.setAccessToken('old-token');
    authSessionStore.setCurrent(oldCurrent as never);
    mocks.session.mockResolvedValueOnce(oldCurrent).mockResolvedValueOnce(newCurrent);
    mocks.login.mockImplementation(async () => {
      expect(authSessionStore.getSnapshot()).toEqual({ accessToken: null, current: null });
      return { accessToken: 'new-token' };
    });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    expect(await screen.findByText('authenticated:Old Admin')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Đổi tài khoản' }));
    expect(await screen.findByText('authenticated:New Customer')).toBeInTheDocument();
    expect(authSessionStore.getSnapshot()).toMatchObject({
      accessToken: 'new-token',
      current: { actor: { id: '8', roles: ['CUSTOMER'] } },
    });
  });
});
