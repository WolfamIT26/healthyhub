import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ refresh: vi.fn(), session: vi.fn() }));
vi.mock('../../services/api/httpClient', () => ({ refreshAccessToken: mocks.refresh }));
vi.mock('./authApi', () => ({
  authApi: { session: mocks.session, login: vi.fn(), logout: vi.fn() },
}));

import { AuthProvider, useAuth } from './AuthContext';
import { authSessionStore } from './authSessionStore';

function Probe() {
  const auth = useAuth();
  return (
    <p>
      {auth.status}:{auth.actor?.fullName ?? 'none'}
    </p>
  );
}

describe('AuthProvider session restore', () => {
  beforeEach(() => authSessionStore.clear());

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
});
