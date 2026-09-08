import { describe, expect, it, vi } from 'vitest';

import type { RequestWithContext } from '../../common/types/request-with-context';
import { AccessTokenGuard, PermissionsGuard, RolesGuard } from './authentication.guards';

function context(request: Partial<RequestWithContext>) {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => undefined,
    getClass: () => undefined,
  } as never;
}

function setup(
  options: {
    claimedRoles?: Array<'CUSTOMER' | 'ADMINISTRATOR'>;
    currentRoles?: Array<'CUSTOMER' | 'ADMINISTRATOR'>;
    accountStatus?: 'active' | 'pending' | 'disabled' | 'locked';
  } = {},
) {
  const request = { headers: { authorization: 'Bearer signed-token' } } as RequestWithContext;
  const tokens = {
    verifyAccessToken: vi.fn().mockResolvedValue({
      sub: '7',
      sid: 'session-public',
      roles: options.claimedRoles ?? ['ADMINISTRATOR'],
      permissionsVersion: 1,
    }),
  };
  const repository = {
    findSessionByPublicId: vi.fn().mockResolvedValue({
      id: '21',
      userAccountId: '7',
      sessionPublicId: 'session-public',
      sessionStatus: 'active',
      expiresAt: new Date(Date.now() + 60_000),
    }),
    findAccountById: vi.fn().mockResolvedValue({
      id: '7',
      userStatus: options.accountStatus ?? 'active',
      permissionsVersion: 3,
      deletedAt: null,
    }),
    getRoleNames: vi.fn().mockResolvedValue(options.currentRoles ?? ['ADMINISTRATOR']),
  };
  return {
    request,
    repository,
    guard: new AccessTokenGuard(tokens as never, repository as never),
  };
}

describe('AccessTokenGuard current actor authority', () => {
  it('rejects Guest requests before any repository access', async () => {
    const tokens = { verifyAccessToken: vi.fn() };
    const repository = { findSessionByPublicId: vi.fn() };
    const guard = new AccessTokenGuard(tokens as never, repository as never);

    await expect(guard.canActivate(context({ headers: {} }))).rejects.toMatchObject({
      status: 401,
    });
    expect(tokens.verifyAccessToken).not.toHaveBeenCalled();
  });

  it('derives current roles and permission version from persistence, not JWT role claims', async () => {
    const { guard, request } = setup({
      claimedRoles: ['ADMINISTRATOR'],
      currentRoles: ['CUSTOMER'],
    });

    await expect(guard.canActivate(context(request))).resolves.toBe(true);
    expect(request.auth).toMatchObject({
      userAccountId: '7',
      roles: ['CUSTOMER'],
      permissionsVersion: 3,
    });
  });

  it.each([
    ['disabled', 403],
    ['locked', 423],
  ] as const)('rejects a %s persisted actor', async (accountStatus, status) => {
    const { guard, request } = setup({ accountStatus });
    await expect(guard.canActivate(context(request))).rejects.toMatchObject({ status });
  });

  it('preserves the canonical pending Customer session policy but rejects pending Internal actors', async () => {
    const customer = setup({ accountStatus: 'pending', currentRoles: ['CUSTOMER'] });
    await expect(customer.guard.canActivate(context(customer.request))).resolves.toBe(true);

    const internal = setup({ accountStatus: 'pending', currentRoles: ['ADMINISTRATOR'] });
    await expect(internal.guard.canActivate(context(internal.request))).rejects.toMatchObject({
      status: 401,
    });
  });

  it('prevents a forged Admin claim from bypassing the current Customer role', async () => {
    const { guard, request } = setup({
      claimedRoles: ['ADMINISTRATOR'],
      currentRoles: ['CUSTOMER'],
    });
    await guard.canActivate(context(request));
    const roles = new RolesGuard({
      getAllAndOverride: vi.fn().mockReturnValue(['STAFF', 'MANAGER', 'ADMINISTRATOR']),
    } as never);

    expect(() => roles.canActivate(context(request))).toThrowError(
      expect.objectContaining({ status: 403 }),
    );
  });
});

describe('PermissionsGuard persisted authority', () => {
  it('allows a current effective Product permission and rejects a missing one', async () => {
    const reflector = {
      getAllAndOverride: vi.fn().mockReturnValue(['products:read']),
    };
    const repository = { getEffectivePermissions: vi.fn().mockResolvedValue(['products:read']) };
    const guard = new PermissionsGuard(reflector as never, repository as never);
    const request = {
      headers: {},
      auth: {
        userAccountId: '7',
        sessionId: '1',
        sessionPublicId: 'session',
        roles: ['STAFF'],
        permissionsVersion: 1,
      },
    } as RequestWithContext;

    await expect(guard.canActivate(context(request))).resolves.toBe(true);
    reflector.getAllAndOverride.mockReturnValue(['products:manage']);
    await expect(guard.canActivate(context(request))).rejects.toMatchObject({ status: 403 });
    expect(repository.getEffectivePermissions).toHaveBeenCalledWith('7');
  });
});
