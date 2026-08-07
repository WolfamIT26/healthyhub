import { describe, expect, it, vi } from 'vitest';

import type { HealthyHubEnvironment } from '../../config/environment';
import { AuthenticationException } from './authentication.exception';
import { AuthenticationService } from './authentication.service';

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
    countFailedLoginAttempts: vi.fn(),
    recordLoginAttempt: vi.fn(),
  };
  const notifications = { sendPasswordReset: vi.fn(), sendEmailVerification: vi.fn() };
  const crypto = {
    normalizeEmail: (value: string) => value.trim().toLowerCase(),
    digest: (value: string) => `hash:${value}`,
    randomToken: () => 'opaque-token',
    safeEqual: (left: string, right: string) => left === right,
    identifierDigest: (value: string) => `identifier:${value}`,
  };
  const audit = { emit: vi.fn() };
  const rateLimit = { enforce: vi.fn() };
  const service = new AuthenticationService(
    repository as never,
    notifications,
    crypto as never,
    {} as never,
    audit as never,
    rateLimit as never,
    env,
  );
  return { service, repository, notifications, audit };
}

describe('AuthenticationService security flows', () => {
  it('returns the same accepted result when forgot-password account does not exist', async () => {
    const { service, repository, notifications } = setup();
    repository.findAccountByNormalizedEmail.mockResolvedValue(null);
    await expect(service.forgotPassword('unknown@example.com')).resolves.toEqual({ accepted: true });
    expect(notifications.sendPasswordReset).not.toHaveBeenCalled();
  });

  it('stores only a digest and sends the raw reset token through the gateway', async () => {
    const { service, repository, notifications } = setup();
    repository.findAccountByNormalizedEmail.mockResolvedValue({
      id: '10',
      email: 'known@example.com',
      userStatus: 'active',
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

  it('marks an older refresh generation compromised and rejects reuse', async () => {
    const { service, repository, audit } = setup();
    repository.findSessionByPublicId.mockResolvedValue({
      id: '20',
      sessionPublicId: 'session',
      refreshTokenGeneration: 2,
    });
    await expect(service.refresh('session.1.old-secret')).rejects.toBeInstanceOf(AuthenticationException);
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
});
