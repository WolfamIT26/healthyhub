import type { ApiSuccessEnvelope } from './index';

export const ACCOUNT_STATUSES = ['pending', 'active', 'locked', 'disabled'] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const SESSION_STATUSES = ['active', 'expired', 'revoked', 'compromised'] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const TOKEN_PURPOSES = ['email_verification', 'password_reset', 'refresh'] as const;
export type TokenPurpose = (typeof TOKEN_PURPOSES)[number];

export const ROLE_NAMES = ['CUSTOMER', 'STAFF', 'MANAGER', 'ADMINISTRATOR'] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const PERMISSION_NAMES = ['users:manage', 'sessions:manage'] as const;
export type PermissionName = (typeof PERMISSION_NAMES)[number];

export const AUTHENTICATION_ERROR_CODES = [
  'AUTH.AUTHENTICATION.INVALID_CREDENTIALS',
  'AUTH.EMAIL_NOT_VERIFIED',
  'BUSINESS.AUTHENTICATION.ACCOUNT_LOCKED',
  'BUSINESS.AUTHENTICATION.ACCOUNT_DISABLED',
  'CONFLICT.AUTHENTICATION.EMAIL_ALREADY_EXISTS',
  'AUTH.AUTHENTICATION.TOKEN_INVALID',
  'AUTH.AUTHENTICATION.TOKEN_EXPIRED',
  'AUTH.AUTHENTICATION.TOKEN_REVOKED',
  'AUTH.AUTHENTICATION.REFRESH_TOKEN_REUSED',
  'VALIDATION.AUTHENTICATION.PASSWORD_POLICY_FAILED',
  'AUTH.AUTHENTICATION.RESET_TOKEN_INVALID',
  'PERMISSION.AUTHENTICATION.DENIED',
  'RATE_LIMIT.AUTHENTICATION.EXCEEDED',
] as const;
export type AuthenticationErrorCode = (typeof AUTHENTICATION_ERROR_CODES)[number];

export interface AuthRegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  acceptedTerms?: boolean;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface TokenActionRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ActorSummary {
  id: string;
  email: string;
  fullName: string;
  roles: RoleName[];
  isEmailVerified: boolean;
}

export interface VerificationSummary {
  status: 'pending' | 'verified';
  expiresAt: string;
}

export interface AuthenticationSessionSummary {
  id: string;
  status: SessionStatus;
  issuedAt: string;
  expiresAt: string;
}

export interface TokenMetadata {
  tokenType: 'Bearer';
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt?: string;
}

export interface RegisterResult {
  user: ActorSummary;
  verification: VerificationSummary;
}

export interface AuthenticationResult {
  accessToken: string;
  refreshToken?: string;
  token: TokenMetadata;
  session: AuthenticationSessionSummary;
  actor: ActorSummary;
}

export type TokenRefreshResult = AuthenticationResult;

export interface CurrentSessionResult {
  session: AuthenticationSessionSummary;
  actor: ActorSummary;
  permissions: string[];
  permissionsVersion: number;
}

export interface AuthActionResult {
  accepted?: boolean;
  sessionStatus?: 'revoked';
  verificationStatus?: 'verified';
  passwordChanged?: boolean;
  sessionsRevoked?: boolean;
  otherSessionsRevoked?: boolean;
}

export type RegisterResponse = ApiSuccessEnvelope<RegisterResult>;
export type AuthenticationResponse = ApiSuccessEnvelope<AuthenticationResult>;
export type TokenRefreshResponse = ApiSuccessEnvelope<TokenRefreshResult>;
export type CurrentSessionResponse = ApiSuccessEnvelope<CurrentSessionResult>;
export type AuthActionResponse = ApiSuccessEnvelope<AuthActionResult>;
