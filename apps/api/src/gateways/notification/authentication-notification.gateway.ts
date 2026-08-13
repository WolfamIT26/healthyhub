export const AUTHENTICATION_NOTIFICATION_GATEWAY = Symbol('AUTHENTICATION_NOTIFICATION_GATEWAY');

export interface AuthenticationNotificationGateway {
  sendEmailVerification(recipient: string, rawToken: string, expiresAt: Date): Promise<void>;
  sendPasswordReset(recipient: string, rawToken: string, expiresAt: Date): Promise<void>;
}

export class LocalAuthenticationNotificationGateway implements AuthenticationNotificationGateway {
  async sendEmailVerification(
    _recipient: string,
    _rawToken: string,
    _expiresAt: Date,
  ): Promise<void> {
    return Promise.resolve();
  }

  async sendPasswordReset(_recipient: string, _rawToken: string, _expiresAt: Date): Promise<void> {
    return Promise.resolve();
  }
}
