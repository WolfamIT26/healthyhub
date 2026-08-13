import { describe, expect, it, vi } from 'vitest';

import type { HealthyHubEnvironment } from '../../config/environment';
import { AuthenticationException } from './authentication.exception';
import { AuthenticationService } from './authentication.service';
import { EmailVerificationPolicyService } from './email-verification-policy.service';

const env = {
  authentication: {
    refreshTokenTtlSeconds: 2_592_000,
    resetTokenTtlSeconds: 900,
    verificationTokenTtlSeconds: 86_400,
  },
} as HealthyHubEnvironment;

function setup() {
  const repository = {
    findAccountByNormalizedEmail: vi.fn(),
    findSessionByPublicId: vi.fn(),
    markRefreshReuse: vi.fn(),
    revokeSession: vi.fn(),
    revokeAllSessions: vi.fn(),
    createPasswordReset: vi.fn(),
    findPasswordReset: vi.fn(),
    consumePasswordReset: vi.fn(),
    findAccountById: vi.fn(),
    updatePassword: vi.fn(),
    revokeOtherSessions: vi.fn(),
    createAccount: vi.fn(),
    createCustomerProfile: vi.fn(),
    assignRole: vi.fn(),
    emailExists: vi.fn(),
    countFailedLoginAttempts: vi.fn(),
    recordLoginAttempt: vi.fn(),
    getRoleNames: vi.fn(),
    createSession: vi.fn(),
    touchLastLogin: vi.fn(),
    createEmailVerification: vi.fn(),
  };
  const notifications = { sendPasswordReset: vi.fn(), sendEmailVerification: vi.fn() };
  const crypto = {
    normalizeEmail: (value: string) => value.trim().toLowerCase(),
    digest: (value: string) => `hash:${value}`,
    randomToken: () => 'opaque-token',
    safeEqual: (left: string, right: string) => left === right,
    identifierDigest: (value: string) => `identifier:${value}`,
    assertPasswordAllowed: vi.fn(() => true),
    verifyPassword: vi.fn(() => Promise.resolve(true)),
    hashPassword: vi.fn(() => Promise.resolve('password-hash')),
  };
  const audit = { emit: vi.fn() };
  const rateLimit = { enforce: vi.fn() };
  const tokens = {
    issueAccessToken: vi
      .fn()
      .mockResolvedValue({ accessToken: 'access-token', expiresAt: new Date(Date.now() + 60_000) }),
  };
  const service = new AuthenticationService(
    repository as never,
    notifications,
    crypto as never,
    tokens as never,
    audit as never,
    rateLimit as never,
    new EmailVerificationPolicyService(),
    env,
  );
  return { service, repository, notifications, audit, crypto, tokens };
}

describe('AuthenticationService security flows', () => {
  it('returns the same accepted result when forgot-password account does not exist', async () => {
    const { service, repository, notifications } = setup();
    repository.findAccountByNormalizedEmail.mockResolvedValue(null);
    await expect(service.forgotPassword('unknown@example.com')).resolves.toEqual({
      accepted: true,
    });
    expect(notifications.sendPasswordReset).not.toHaveBeenCalled();
  });

  it('stores only a digest and sends the raw reset token through the gateway', async () => {
    const { service, repository, notifications } = setup();
    repository.findAccountByNormalizedEmail.mockResolvedValue({
      id: '10',
      email: 'known@example.com',
      userStatus: 'active',
      emailVerifiedAt: new Date(),
    });
    await expect(service.forgotPassword('KNOWN@example.com')).resolves.toEqual({ accepted: true });
    expect(repository.createPasswordReset).toHaveBeenCalledWith(
      expect.objectContaining({ tokenReference: 'hash:opaque-token' }),
    );
    expect(notifications.sendPasswordReset).toHaveBeenCalledWith(
      'known@example.com',
      'opaque-token',
      expect.any(Date),
    );
  });

  it('blocks forgot-password for an unverified account', async () => {
    const { service, repository, notifications } = setup();
    repository.findAccountByNormalizedEmail.mockResolvedValue({
      id: '10',
      email: 'customer@example.com',
      userStatus: 'pending',
      emailVerifiedAt: null,
    });

    await expect(service.forgotPassword('customer@example.com')).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'AUTH.EMAIL_NOT_VERIFIED' }),
    });
    expect(repository.createPasswordReset).not.toHaveBeenCalled();
    expect(notifications.sendPasswordReset).not.toHaveBeenCalled();
  });

  it('resends verification for an unverified Customer', async () => {
    const { service, repository, notifications } = setup();
    repository.findAccountByNormalizedEmail.mockResolvedValue({
      id: '10',
      email: 'customer@example.com',
      userStatus: 'pending',
      emailVerifiedAt: null,
    });

    await expect(service.resendVerification('customer@example.com')).resolves.toEqual({
      accepted: true,
    });
    expect(repository.createEmailVerification).toHaveBeenCalledWith(
      expect.objectContaining({ userAccountId: '10' }),
    );
    expect(notifications.sendEmailVerification).toHaveBeenCalledWith(
      'customer@example.com',
      'opaque-token',
      expect.any(Date),
    );
  });

  it('marks an older refresh generation compromised and rejects reuse', async () => {
    const { service, repository, audit } = setup();
    repository.findSessionByPublicId.mockResolvedValue({
      id: '20',
      sessionPublicId: 'session',
      refreshTokenGeneration: 2,
    });
    await expect(service.refresh('session.1.old-secret')).rejects.toBeInstanceOf(
      AuthenticationException,
    );
    expect(repository.markRefreshReuse).toHaveBeenCalledWith('20', expect.any(Date));
    expect(audit.emit).toHaveBeenCalledWith('refresh_reuse_detected', { sessionId: 'session' });
  });

  it('revokes the authenticated session on logout', async () => {
    const { service, repository } = setup();
    await expect(
      service.logout({
        userAccountId: '10',
        sessionId: '20',
        sessionPublicId: 'session',
        roles: ['CUSTOMER'],
        permissionsVersion: 1,
      }),
    ).resolves.toEqual({ sessionStatus: 'revoked' });
    expect(repository.revokeSession).toHaveBeenCalledWith('20', 'user_logout', expect.any(Date));
  });

  it('keeps failed-login attempt audit working with a normalized browser family', async () => {
    const { service, repository } = setup();
    repository.findAccountByNormalizedEmail.mockResolvedValue(null);
    repository.countFailedLoginAttempts.mockResolvedValue(0);
    repository.recordLoginAttempt.mockResolvedValue({ id: 'attempt-1' });
    const longChromeUserAgent =
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 ' +
      'Safari/537.36 '.repeat(100);

    await expect(
      service.login(
        { email: 'unknown@example.com', password: 'incorrect-password' },
        { ip: '127.0.0.1', userAgent: longChromeUserAgent },
      ),
    ).rejects.toBeInstanceOf(AuthenticationException);

    expect(repository.recordLoginAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
        failureReason: 'invalid_credentials',
        userAgentFamily: 'Chrome',
      }),
    );
  });

  it('enforces email-aware password policy during registration', async () => {
    const { service, crypto, repository } = setup();
    crypto.assertPasswordAllowed.mockReturnValue(false);

    await expect(
      service.register({
        email: 'PhamViet@gmail.com',
        password: 'Secure-phamviet-2026',
        fullName: 'Pham Viet',
      }),
    ).rejects.toBeInstanceOf(AuthenticationException);

    expect(crypto.assertPasswordAllowed).toHaveBeenCalledWith(
      'Secure-phamviet-2026',
      'phamviet@gmail.com',
    );
    expect(repository.createAccount).not.toHaveBeenCalled();
  });

  it('creates the approved CustomerProfile mapping during Customer registration', async () => {
    const { service, repository, notifications } = setup();
    repository.emailExists.mockResolvedValue(false);
    repository.createAccount.mockResolvedValue({
      id: '42',
      email: 'customer@example.com',
      displayName: 'Customer',
      phone: null,
    });
    repository.createEmailVerification.mockResolvedValue({ id: 'verification-1' });
    notifications.sendEmailVerification.mockResolvedValue(undefined);

    await service.register({
      email: 'customer@example.com',
      password: 'Strong-Password-2026!',
      fullName: 'Customer',
    });

    expect(repository.assignRole).toHaveBeenCalledWith('42', 'CUSTOMER', expect.any(Date));
    expect(repository.createCustomerProfile).toHaveBeenCalledWith(
      '42',
      'Customer',
      'customer@example.com',
      null,
    );
  });

  it('enforces the account email policy before consuming a reset token', async () => {
    const { service, crypto, repository } = setup();
    repository.findPasswordReset.mockResolvedValue({ userAccountId: '10' });
    repository.findAccountById.mockResolvedValue({
      id: '10',
      normalizedEmail: 'person@yahoo.com',
      emailVerifiedAt: new Date(),
    });
    crypto.assertPasswordAllowed.mockReturnValueOnce(true).mockReturnValueOnce(false);

    await expect(
      service.resetPassword({
        token: 'reset-token',
        newPassword: 'Secure-yahoo-2026',
      }),
    ).rejects.toBeInstanceOf(AuthenticationException);

    expect(crypto.assertPasswordAllowed).toHaveBeenLastCalledWith(
      'Secure-yahoo-2026',
      'person@yahoo.com',
    );
    expect(repository.consumePasswordReset).not.toHaveBeenCalled();
  });

  it('blocks reset-password for an unverified account before consuming the token', async () => {
    const { service, repository } = setup();
    repository.findPasswordReset.mockResolvedValue({ userAccountId: '10' });
    repository.findAccountById.mockResolvedValue({
      id: '10',
      normalizedEmail: 'customer@example.com',
      emailVerifiedAt: null,
    });

    await expect(
      service.resetPassword({ token: 'reset-token', newPassword: 'River@Stone-2026' }),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'AUTH.EMAIL_NOT_VERIFIED' }),
    });
    expect(repository.consumePasswordReset).not.toHaveBeenCalled();
  });

  it('enforces the account email policy when changing a password', async () => {
    const { service, crypto, repository } = setup();
    repository.findAccountById.mockResolvedValue({
      id: '10',
      normalizedEmail: 'person@icloud.com',
      emailVerifiedAt: new Date(),
    });
    repository.findAccountByNormalizedEmail.mockResolvedValue({
      id: '10',
      normalizedEmail: 'person@icloud.com',
      passwordHash: 'current-hash',
      emailVerifiedAt: new Date(),
    });
    crypto.assertPasswordAllowed.mockReturnValueOnce(true).mockReturnValueOnce(false);

    await expect(
      service.changePassword(
        {
          userAccountId: '10',
          sessionId: '20',
          sessionPublicId: 'session',
          roles: ['CUSTOMER'],
          permissionsVersion: 1,
        },
        {
          currentPassword: 'current-password',
          newPassword: 'Secure-icloud-2026',
        },
      ),
    ).rejects.toBeInstanceOf(AuthenticationException);

    expect(crypto.assertPasswordAllowed).toHaveBeenLastCalledWith(
      'Secure-icloud-2026',
      'person@icloud.com',
    );
    expect(repository.updatePassword).not.toHaveBeenCalled();
  });

  it('blocks change-password for an unverified Customer', async () => {
    const { service, repository } = setup();
    repository.findAccountById.mockResolvedValue({
      id: '10',
      normalizedEmail: 'customer@example.com',
    });
    repository.findAccountByNormalizedEmail.mockResolvedValue({
      id: '10',
      normalizedEmail: 'customer@example.com',
      passwordHash: 'current-hash',
      emailVerifiedAt: null,
    });

    await expect(
      service.changePassword(
        {
          userAccountId: '10',
          sessionId: '20',
          sessionPublicId: 'session',
          roles: ['CUSTOMER'],
          permissionsVersion: 1,
        },
        { currentPassword: 'current-password', newPassword: 'River@Stone-2026' },
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'AUTH.EMAIL_NOT_VERIFIED' }),
    });
    expect(repository.updatePassword).not.toHaveBeenCalled();
  });

  it('allows an unverified pending Customer to login and receive a session token', async () => {
    const { service, repository } = setup();
    const now = new Date();
    repository.findAccountByNormalizedEmail.mockResolvedValue({
      id: '10',
      email: 'customer@example.com',
      normalizedEmail: 'customer@example.com',
      displayName: 'Customer',
      passwordHash: 'hash',
      userStatus: 'pending',
      emailVerifiedAt: null,
      lockedUntil: null,
      permissionsVersion: 1,
    });
    repository.countFailedLoginAttempts.mockResolvedValue(0);
    repository.getRoleNames.mockResolvedValue(['CUSTOMER']);
    repository.createSession.mockResolvedValue({
      id: '20',
      sessionPublicId: 'session',
      sessionStatus: 'active',
      issuedAt: now,
      expiresAt: new Date(now.getTime() + 60_000),
    });

    const result = await service.login(
      { email: 'customer@example.com', password: 'correct-password' },
      {},
    );

    expect(result.accessToken).toBe('access-token');
    expect(result.actor).toEqual(
      expect.objectContaining({ isEmailVerified: false, roles: ['CUSTOMER'] }),
    );
    expect(repository.createSession).toHaveBeenCalledOnce();
  });

  it('rejects an unverified Internal account without creating a session', async () => {
    const { service, repository } = setup();
    repository.findAccountByNormalizedEmail.mockResolvedValue({
      id: '10',
      email: 'staff@example.com',
      normalizedEmail: 'staff@example.com',
      displayName: 'Staff',
      passwordHash: 'hash',
      userStatus: 'pending',
      emailVerifiedAt: null,
      lockedUntil: null,
      permissionsVersion: 1,
    });
    repository.countFailedLoginAttempts.mockResolvedValue(0);
    repository.getRoleNames.mockResolvedValue(['STAFF']);

    await expect(
      service.login({ email: 'staff@example.com', password: 'correct-password' }, {}),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'AUTH.EMAIL_NOT_VERIFIED' }),
    });
    expect(repository.createSession).not.toHaveBeenCalled();
  });

  it('allows a verified Internal account to login', async () => {
    const { service, repository } = setup();
    const now = new Date();
    repository.findAccountByNormalizedEmail.mockResolvedValue({
      id: '10',
      email: 'admin@example.com',
      normalizedEmail: 'admin@example.com',
      displayName: 'Admin',
      passwordHash: 'hash',
      userStatus: 'active',
      emailVerifiedAt: now,
      lockedUntil: null,
      permissionsVersion: 1,
    });
    repository.countFailedLoginAttempts.mockResolvedValue(0);
    repository.getRoleNames.mockResolvedValue(['ADMINISTRATOR']);
    repository.createSession.mockResolvedValue({
      id: '20',
      sessionPublicId: 'session',
      sessionStatus: 'active',
      issuedAt: now,
      expiresAt: new Date(now.getTime() + 60_000),
    });

    await expect(
      service.login({ email: 'admin@example.com', password: 'correct-password' }, {}),
    ).resolves.toEqual(
      expect.objectContaining({ actor: expect.objectContaining({ isEmailVerified: true }) }),
    );
  });
});
