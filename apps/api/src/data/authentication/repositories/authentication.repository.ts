import type { AccountStatus, RoleName } from '@healthyhub/shared-types';

import type {
  AccountVerificationEntity,
  AuthenticationSessionEntity,
  LoginAttemptEntity,
  PasswordResetRequestEntity,
  SessionContext,
} from '../entities';
import type { UserAccountEntity } from '../../user/entities';

export interface CreateUserAccountInput {
  email: string;
  normalizedEmail: string;
  displayName: string;
  passwordHash: string;
  phone?: string | null;
}

export interface CreateSessionInput {
  userAccountId: string;
  sessionPublicId: string;
  refreshTokenHash: string;
  refreshTokenFamilyId: string;
  context?: SessionContext | null;
  issuedAt: Date;
  expiresAt: Date;
}

export interface RotateSessionInput {
  sessionId: string;
  expectedGeneration: number;
  nextHash: string;
  nextGeneration: number;
  lastUsedAt: Date;
  expiresAt: Date;
}

export interface RecordLoginAttemptInput {
  userAccountId?: string | null;
  identifierHash: string;
  ipHash?: string | null;
  userAgentFamily?: string | null;
  status: 'success' | 'failed' | 'blocked';
  failureReason?: string | null;
  attemptedAt: Date;
}

export interface CreateOneTimeTokenInput {
  userAccountId: string;
  tokenReference: string;
  expiresAt: Date;
  now: Date;
}

export interface AuthenticationRepository {
  findAccountById(userAccountId: string): Promise<UserAccountEntity | null>;
  findAccountByNormalizedEmail(normalizedEmail: string): Promise<UserAccountEntity | null>;
  emailExists(normalizedEmail: string): Promise<boolean>;
  createAccount(input: CreateUserAccountInput): Promise<UserAccountEntity>;
  createCustomerProfile(
    userAccountId: string,
    fullName: string,
    email: string,
    phone: string | null,
  ): Promise<void>;
  assignRole(userAccountId: string, role: RoleName, assignedAt: Date): Promise<void>;
  updatePassword(userAccountId: string, passwordHash: string): Promise<void>;
  markEmailVerified(userAccountId: string, verifiedAt: Date): Promise<void>;
  touchLastLogin(userAccountId: string, loggedInAt: Date): Promise<void>;
  setAccountStatus(
    userAccountId: string,
    status: AccountStatus,
    lockedUntil?: Date | null,
  ): Promise<void>;
  createSession(input: CreateSessionInput): Promise<AuthenticationSessionEntity>;
  findSessionByPublicId(sessionPublicId: string): Promise<AuthenticationSessionEntity | null>;
  rotateSession(input: RotateSessionInput): Promise<boolean>;
  revokeSession(sessionId: string, reason: string, revokedAt: Date): Promise<void>;
  revokeAllSessions(userAccountId: string, reason: string, revokedAt: Date): Promise<number>;
  revokeOtherSessions(
    userAccountId: string,
    currentSessionId: string,
    reason: string,
    revokedAt: Date,
  ): Promise<number>;
  markRefreshReuse(sessionId: string, compromisedAt: Date): Promise<void>;
  createPasswordReset(input: CreateOneTimeTokenInput): Promise<PasswordResetRequestEntity>;
  findPasswordReset(tokenReference: string): Promise<PasswordResetRequestEntity | null>;
  consumePasswordReset(tokenReference: string, consumedAt: Date): Promise<boolean>;
  createEmailVerification(input: CreateOneTimeTokenInput): Promise<AccountVerificationEntity>;
  findEmailVerification(tokenReference: string): Promise<AccountVerificationEntity | null>;
  consumeEmailVerification(tokenReference: string, consumedAt: Date): Promise<boolean>;
  recordLoginAttempt(input: RecordLoginAttemptInput): Promise<LoginAttemptEntity>;
  countFailedLoginAttempts(identifierHash: string, since: Date): Promise<number>;
  getRoleNames(userAccountId: string): Promise<RoleName[]>;
  getEffectivePermissions(userAccountId: string): Promise<string[]>;
}

export const AUTHENTICATION_REPOSITORY = Symbol('AUTHENTICATION_REPOSITORY');
