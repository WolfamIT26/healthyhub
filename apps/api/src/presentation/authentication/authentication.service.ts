import { randomUUID } from 'node:crypto';

import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import type {
  ActorSummary,
  AuthActionResult,
  AuthenticationResult,
  CurrentSessionResult,
  RegisterResult,
} from '@healthyhub/shared-types';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import type { HealthyHubEnvironment } from '../../config/environment';
import {
  AUTHENTICATION_REPOSITORY,
  type AuthenticationRepository,
} from '../../data/authentication/repositories';
import {
  AUTHENTICATION_NOTIFICATION_GATEWAY,
  type AuthenticationNotificationGateway,
} from '../../gateways/notification/authentication-notification.gateway';
import { AuthenticationAuditService } from './authentication-audit.service';
import { AuthenticationCrypto } from './authentication.crypto';
import { AuthenticationException } from './authentication.exception';
import { AuthenticationTokenService } from './authentication-token.service';
import { AuthenticationRateLimitService } from './authentication-rate-limit.service';
import { getUserAgentFamily } from './user-agent-family';
import { EmailVerificationPolicyService } from './email-verification-policy.service';
import type {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './authentication.dto';

export interface AuthenticationRequestContext {
  ip?: string;
  userAgent?: string;
  platform?: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(AUTHENTICATION_REPOSITORY) private readonly repository: AuthenticationRepository,
    @Inject(AUTHENTICATION_NOTIFICATION_GATEWAY)
    private readonly notifications: AuthenticationNotificationGateway,
    private readonly crypto: AuthenticationCrypto,
    private readonly tokens: AuthenticationTokenService,
    private readonly audit: AuthenticationAuditService,
    private readonly rateLimit: AuthenticationRateLimitService,
    private readonly emailVerificationPolicy: EmailVerificationPolicyService,
    @Inject('HealthyHubEnvironment') private readonly env: HealthyHubEnvironment,
  ) {}

  async register(input: RegisterDto): Promise<RegisterResult> {
    const normalizedEmail = this.crypto.normalizeEmail(input.email);
    this.rateLimit.enforce('register', normalizedEmail, undefined, 5, 15 * 60 * 1000);
    if (!this.crypto.assertPasswordAllowed(input.password, normalizedEmail))
      this.passwordPolicyFailed();
    if (await this.repository.emailExists(normalizedEmail)) {
      throw new AuthenticationException(
        HttpStatus.CONFLICT,
        'CONFLICT.AUTHENTICATION.EMAIL_ALREADY_EXISTS',
        'CONFLICT',
        'Địa chỉ email đã được sử dụng.',
      );
    }
    const now = new Date();
    const account = await this.repository.createAccount({
      email: input.email.trim(),
      normalizedEmail,
      displayName: input.fullName.trim(),
      passwordHash: await this.crypto.hashPassword(input.password),
      phone: input.phone?.trim() || null,
    });
    await this.repository.assignRole(account.id, 'CUSTOMER', now);
    await this.repository.createCustomerProfile(
      account.id,
      account.displayName,
      account.email,
      account.phone,
    );
    const verification = await this.createVerification(account.id, account.email, now);
    this.audit.emit('register_succeeded', { userAccountId: account.id });
    return {
      user: this.actor(account, ['CUSTOMER']),
      verification: { status: 'pending', expiresAt: verification.toISOString() },
    };
  }

  async login(
    input: LoginDto,
    context: AuthenticationRequestContext,
  ): Promise<AuthenticationResult> {
    const now = new Date();
    const normalizedEmail = this.crypto.normalizeEmail(input.email);
    this.rateLimit.enforce('login', normalizedEmail, context.ip, 10, 15 * 60 * 1000);
    const identifierHash = this.crypto.identifierDigest(normalizedEmail);
    const account = await this.repository.findAccountByNormalizedEmail(normalizedEmail);
    const failed = await this.repository.countFailedLoginAttempts(
      identifierHash,
      new Date(now.getTime() - 15 * 60 * 1000),
    );
    if (failed >= 5 || (account?.lockedUntil && account.lockedUntil > now)) {
      if (account && (!account.lockedUntil || account.lockedUntil <= now)) {
        await this.repository.setAccountStatus(
          account.id,
          'locked',
          new Date(now.getTime() + 15 * 60 * 1000),
        );
      }
      await this.recordAttempt(
        account?.id,
        identifierHash,
        context,
        'blocked',
        'account_locked',
        now,
      );
      throw new AuthenticationException(
        HttpStatus.LOCKED,
        'BUSINESS.AUTHENTICATION.ACCOUNT_LOCKED',
        'BUSINESS',
        'Tài khoản tạm thời bị khóa. Vui lòng thử lại sau.',
      );
    }
    const passwordValid = account
      ? await this.crypto.verifyPassword(account.passwordHash, input.password)
      : false;
    if (!account || !passwordValid) {
      await this.recordAttempt(
        account?.id,
        identifierHash,
        context,
        'failed',
        'invalid_credentials',
        now,
      );
      if (failed + 1 >= 5 && account) {
        await this.repository.setAccountStatus(
          account.id,
          'locked',
          new Date(now.getTime() + 15 * 60 * 1000),
        );
      }
      this.invalidCredentials();
    }
    const roles = await this.repository.getRoleNames(account.id);
    if (account.userStatus === 'disabled') {
      throw new AuthenticationException(
        HttpStatus.FORBIDDEN,
        'BUSINESS.AUTHENTICATION.ACCOUNT_DISABLED',
        'BUSINESS',
        'Tài khoản đã bị vô hiệu hóa.',
      );
    }
    if (account.userStatus === 'locked' && (!account.lockedUntil || account.lockedUntil <= now)) {
      await this.repository.setAccountStatus(account.id, 'active', null);
      account.userStatus = 'active';
    }
    try {
      this.emailVerificationPolicy.assertLoginAllowed(account, roles);
    } catch (error) {
      await this.recordAttempt(
        account.id,
        identifierHash,
        context,
        'blocked',
        'email_not_verified',
        now,
      );
      throw error;
    }
    await this.recordAttempt(account.id, identifierHash, context, 'success', null, now);
    await this.repository.touchLastLogin(account.id, now);
    const result = await this.createSession(account, roles, context, now);
    this.audit.emit('login_succeeded', { userAccountId: account.id, sessionId: result.session.id });
    return result;
  }

  async refresh(rawToken: string): Promise<AuthenticationResult> {
    const parsed = this.parseRefreshToken(rawToken);
    const session = parsed && (await this.repository.findSessionByPublicId(parsed.sessionPublicId));
    const now = new Date();
    if (!parsed || !session) this.invalidToken();
    if (parsed.generation < session.refreshTokenGeneration) {
      await this.repository.markRefreshReuse(session.id, now);
      this.audit.emit('refresh_reuse_detected', { sessionId: session.sessionPublicId });
      throw new AuthenticationException(
        HttpStatus.UNAUTHORIZED,
        'AUTH.AUTHENTICATION.REFRESH_TOKEN_REUSED',
        'AUTH',
        'Refresh token đã được sử dụng lại; phiên đã bị thu hồi.',
      );
    }
    if (
      parsed.generation !== session.refreshTokenGeneration ||
      session.sessionStatus !== 'active' ||
      session.expiresAt <= now ||
      !this.crypto.safeEqual(this.crypto.digest(rawToken), session.refreshTokenHash)
    )
      this.invalidToken();
    const account = await this.repository.findAccountById(session.userAccountId);
    if (!account) this.invalidToken();
    const roles = await this.repository.getRoleNames(account.id);
    if (!this.emailVerificationPolicy.canUseSession(account, roles)) this.invalidToken();
    const nextGeneration = session.refreshTokenGeneration + 1;
    const nextRaw = this.formatRefreshToken(session.sessionPublicId, nextGeneration);
    const expiresAt = new Date(
      now.getTime() + this.env.authentication.refreshTokenTtlSeconds * 1000,
    );
    const rotated = await this.repository.rotateSession({
      sessionId: session.id,
      expectedGeneration: session.refreshTokenGeneration,
      nextHash: this.crypto.digest(nextRaw),
      nextGeneration,
      lastUsedAt: now,
      expiresAt,
    });
    if (!rotated) {
      await this.repository.markRefreshReuse(session.id, now);
      throw new AuthenticationException(
        HttpStatus.UNAUTHORIZED,
        'AUTH.AUTHENTICATION.REFRESH_TOKEN_REUSED',
        'AUTH',
        'Refresh token đã được sử dụng lại; phiên đã bị thu hồi.',
      );
    }
    return this.authenticationResult(account, roles, session, nextRaw, expiresAt);
  }

  async logout(auth: AuthenticatedRequestContext): Promise<AuthActionResult> {
    await this.repository.revokeSession(auth.sessionId, 'user_logout', new Date());
    this.audit.emit('logout_succeeded', {
      userAccountId: auth.userAccountId,
      sessionId: auth.sessionPublicId,
    });
    return { sessionStatus: 'revoked' };
  }

  async logoutAll(auth: AuthenticatedRequestContext): Promise<AuthActionResult> {
    await this.repository.revokeAllSessions(auth.userAccountId, 'user_logout_all', new Date());
    return { sessionsRevoked: true };
  }

  async forgotPassword(email: string): Promise<AuthActionResult> {
    const normalized = this.crypto.normalizeEmail(email);
    this.rateLimit.enforce('forgot-password', normalized, undefined, 5, 15 * 60 * 1000);
    const account = await this.repository.findAccountByNormalizedEmail(normalized);
    if (account && account.userStatus !== 'disabled') {
      this.emailVerificationPolicy.assertVerified(account);
      const raw = this.crypto.randomToken();
      const now = new Date();
      const expiresAt = new Date(
        now.getTime() + this.env.authentication.resetTokenTtlSeconds * 1000,
      );
      await this.repository.createPasswordReset({
        userAccountId: account.id,
        tokenReference: this.crypto.digest(raw),
        expiresAt,
        now,
      });
      await this.notifications.sendPasswordReset(account.email, raw, expiresAt);
      this.audit.emit('password_reset_requested', { userAccountId: account.id });
    }
    return { accepted: true };
  }

  async resetPassword(input: ResetPasswordDto): Promise<AuthActionResult> {
    if (!this.crypto.assertPasswordAllowed(input.newPassword)) this.passwordPolicyFailed();
    const reference = this.crypto.digest(input.token);
    const request = await this.repository.findPasswordReset(reference);
    const now = new Date();
    if (!request) {
      throw new AuthenticationException(
        HttpStatus.UNAUTHORIZED,
        'AUTH.AUTHENTICATION.RESET_TOKEN_INVALID',
        'AUTH',
        'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
      );
    }
    const account = await this.repository.findAccountById(request.userAccountId);
    if (account) this.emailVerificationPolicy.assertVerified(account);
    if (
      !account ||
      !this.crypto.assertPasswordAllowed(input.newPassword, account.normalizedEmail)
    ) {
      if (account) this.passwordPolicyFailed();
      throw new AuthenticationException(
        HttpStatus.UNAUTHORIZED,
        'AUTH.AUTHENTICATION.RESET_TOKEN_INVALID',
        'AUTH',
        'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
      );
    }
    if (!(await this.repository.consumePasswordReset(reference, now))) {
      throw new AuthenticationException(
        HttpStatus.UNAUTHORIZED,
        'AUTH.AUTHENTICATION.RESET_TOKEN_INVALID',
        'AUTH',
        'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
      );
    }
    await this.repository.updatePassword(
      request.userAccountId,
      await this.crypto.hashPassword(input.newPassword),
    );
    await this.repository.revokeAllSessions(request.userAccountId, 'password_reset', now);
    this.audit.emit('password_reset_succeeded', { userAccountId: request.userAccountId });
    return { passwordChanged: true, sessionsRevoked: true };
  }

  async verifyEmail(rawToken: string): Promise<AuthActionResult> {
    const reference = this.crypto.digest(rawToken);
    const verification = await this.repository.findEmailVerification(reference);
    const now = new Date();
    if (!verification || !(await this.repository.consumeEmailVerification(reference, now)))
      this.invalidToken();
    await this.repository.markEmailVerified(verification.userAccountId, now);
    this.audit.emit('email_verified', { userAccountId: verification.userAccountId });
    return { verificationStatus: 'verified' };
  }

  async resendVerification(email: string): Promise<AuthActionResult> {
    const normalized = this.crypto.normalizeEmail(email);
    this.rateLimit.enforce('resend-verification', normalized, undefined, 5, 15 * 60 * 1000);
    const account = await this.repository.findAccountByNormalizedEmail(normalized);
    if (account && !account.emailVerifiedAt && account.userStatus !== 'disabled') {
      await this.createVerification(account.id, account.email, new Date());
    }
    return { accepted: true };
  }

  async current(auth: AuthenticatedRequestContext): Promise<CurrentSessionResult> {
    const account = await this.repository.findAccountById(auth.userAccountId);
    const session = await this.repository.findSessionByPublicId(auth.sessionPublicId);
    if (!account || !session || session.sessionStatus !== 'active') this.invalidToken();
    const roles = await this.repository.getRoleNames(account.id);
    return {
      session: this.sessionSummary(session),
      actor: this.actor(account, roles),
      permissions: await this.repository.getEffectivePermissions(account.id),
      permissionsVersion: account.permissionsVersion,
    };
  }

  async changePassword(
    auth: AuthenticatedRequestContext,
    input: ChangePasswordDto,
  ): Promise<AuthActionResult> {
    if (!this.crypto.assertPasswordAllowed(input.newPassword)) this.passwordPolicyFailed();
    const account = await this.repository.findAccountById(auth.userAccountId);
    const selected =
      account && (await this.repository.findAccountByNormalizedEmail(account.normalizedEmail));
    if (
      !selected ||
      !(await this.crypto.verifyPassword(selected.passwordHash, input.currentPassword))
    ) {
      this.invalidCredentials();
    }
    this.emailVerificationPolicy.assertVerified(selected);
    if (!this.crypto.assertPasswordAllowed(input.newPassword, selected.normalizedEmail))
      this.passwordPolicyFailed();
    await this.repository.updatePassword(
      selected.id,
      await this.crypto.hashPassword(input.newPassword),
    );
    await this.repository.revokeOtherSessions(
      selected.id,
      auth.sessionId,
      'password_changed',
      new Date(),
    );
    this.audit.emit('password_changed', {
      userAccountId: selected.id,
      sessionId: auth.sessionPublicId,
    });
    return { passwordChanged: true, otherSessionsRevoked: true };
  }

  private async createSession(
    account: any,
    roles: any,
    context: AuthenticationRequestContext,
    now: Date,
  ) {
    const sessionPublicId = randomUUID();
    const familyId = randomUUID();
    const raw = this.formatRefreshToken(sessionPublicId, 1);
    const expiresAt = new Date(
      now.getTime() + this.env.authentication.refreshTokenTtlSeconds * 1000,
    );
    const session = await this.repository.createSession({
      userAccountId: account.id,
      sessionPublicId,
      refreshTokenHash: this.crypto.digest(raw),
      refreshTokenFamilyId: familyId,
      context: { platform: context.platform, browserFamily: context.userAgent?.slice(0, 120) },
      issuedAt: now,
      expiresAt,
    });
    return this.authenticationResult(account, roles, session, raw, expiresAt);
  }

  private async authenticationResult(
    account: any,
    roles: any,
    session: any,
    refreshToken: string,
    refreshExpiresAt: Date,
  ): Promise<AuthenticationResult> {
    const access = await this.tokens.issueAccessToken({
      sub: account.id,
      sid: session.sessionPublicId,
      roles,
      permissionsVersion: account.permissionsVersion,
    });
    return {
      accessToken: access.accessToken,
      refreshToken,
      token: {
        tokenType: 'Bearer',
        accessTokenExpiresAt: access.expiresAt.toISOString(),
        refreshTokenExpiresAt: refreshExpiresAt.toISOString(),
      },
      session: this.sessionSummary({ ...session, expiresAt: refreshExpiresAt }),
      actor: this.actor(account, roles),
    };
  }

  private actor(account: any, roles: any): ActorSummary {
    return {
      id: account.id,
      email: account.email,
      fullName: account.displayName,
      roles,
      isEmailVerified: Boolean(account.emailVerifiedAt),
    };
  }

  private sessionSummary(session: any) {
    return {
      id: session.sessionPublicId,
      status: session.sessionStatus,
      issuedAt: session.issuedAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
    };
  }

  private async createVerification(userAccountId: string, email: string, now: Date): Promise<Date> {
    const raw = this.crypto.randomToken();
    const expiresAt = new Date(
      now.getTime() + this.env.authentication.verificationTokenTtlSeconds * 1000,
    );
    await this.repository.createEmailVerification({
      userAccountId,
      tokenReference: this.crypto.digest(raw),
      expiresAt,
      now,
    });
    await this.notifications.sendEmailVerification(email, raw, expiresAt);
    return expiresAt;
  }

  private formatRefreshToken(sessionPublicId: string, generation: number): string {
    return `${sessionPublicId}.${generation}.${this.crypto.randomToken()}`;
  }

  private parseRefreshToken(raw: string) {
    const [sessionPublicId, generationRaw, secret, ...rest] = raw.split('.');
    const generation = Number(generationRaw);
    if (
      !sessionPublicId ||
      !secret ||
      rest.length ||
      !Number.isSafeInteger(generation) ||
      generation < 1
    )
      return null;
    return { sessionPublicId, generation };
  }

  private recordAttempt(
    userAccountId: string | undefined,
    identifierHash: string,
    context: AuthenticationRequestContext,
    status: 'success' | 'failed' | 'blocked',
    failureReason: string | null,
    attemptedAt: Date,
  ) {
    return this.repository.recordLoginAttempt({
      userAccountId,
      identifierHash,
      ipHash: context.ip ? this.crypto.identifierDigest(context.ip) : null,
      userAgentFamily: getUserAgentFamily(context.userAgent),
      status,
      failureReason,
      attemptedAt,
    });
  }

  private invalidCredentials(): never {
    throw new AuthenticationException(
      HttpStatus.UNAUTHORIZED,
      'AUTH.AUTHENTICATION.INVALID_CREDENTIALS',
      'AUTH',
      'Email hoặc mật khẩu không chính xác.',
    );
  }

  private invalidToken(): never {
    throw new AuthenticationException(
      HttpStatus.UNAUTHORIZED,
      'AUTH.AUTHENTICATION.TOKEN_INVALID',
      'AUTH',
      'Token không hợp lệ hoặc đã hết hạn.',
    );
  }

  private passwordPolicyFailed(): never {
    throw new AuthenticationException(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'VALIDATION.AUTHENTICATION.PASSWORD_POLICY_FAILED',
      'VALIDATION',
      'Mật khẩu phải dài 12–128 ký tự, không chứa thông tin email dễ đoán và không thuộc danh sách mật khẩu phổ biến.',
    );
  }
}
