import type {
  AuthActionResponse,
  AuthenticationResponse,
  AuthLoginRequest,
  AuthRegisterRequest,
  CurrentSessionResponse,
  ForgotPasswordRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResetPasswordRequest,
  TokenActionRequest,
} from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';

export const authApi = {
  register: (payload: AuthRegisterRequest) =>
    httpClient.post<RegisterResponse>('/auth/register', payload).then((response) => response.data.data),
  login: (payload: AuthLoginRequest) =>
    httpClient.post<AuthenticationResponse>('/auth/login', payload).then((response) => response.data.data),
  session: () =>
    httpClient.get<CurrentSessionResponse>('/auth/session').then((response) => response.data.data),
  logout: () =>
    httpClient.post<AuthActionResponse>('/auth/logout').then((response) => response.data.data),
  forgotPassword: (payload: ForgotPasswordRequest) =>
    httpClient
      .post<AuthActionResponse>('/auth/forgot-password', payload)
      .then((response) => response.data.data),
  resetPassword: (payload: ResetPasswordRequest) =>
    httpClient
      .post<AuthActionResponse>('/auth/reset-password', payload)
      .then((response) => response.data.data),
  verifyEmail: (payload: TokenActionRequest) =>
    httpClient
      .post<AuthActionResponse>('/auth/verify-email', payload)
      .then((response) => response.data.data),
  resendVerification: (payload: ResendVerificationRequest) =>
    httpClient
      .post<AuthActionResponse>('/auth/resend-verification', payload)
      .then((response) => response.data.data),
};
