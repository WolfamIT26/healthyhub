import { HttpStatus, Injectable } from '@nestjs/common';
import type { AccountStatus, RoleName } from '@healthyhub/shared-types';

import { AuthenticationException } from './authentication.exception';

interface EmailVerificationSubject {
  userStatus: AccountStatus;
  emailVerifiedAt: Date | null;
}

@Injectable()
export class EmailVerificationPolicyService {
  isCustomer(roles: RoleName[]): boolean {
    return roles.length === 1 && roles[0] === 'CUSTOMER';
  }

  canUseSession(subject: EmailVerificationSubject, roles: RoleName[]): boolean {
    if (subject.userStatus !== 'active' && subject.userStatus !== 'pending') return false;
    return Boolean(subject.emailVerifiedAt) || this.isCustomer(roles);
  }

  assertLoginAllowed(subject: EmailVerificationSubject, roles: RoleName[]): void {
    if (subject.emailVerifiedAt) return;
    if (this.isCustomer(roles)) return;
    this.emailNotVerified();
  }

  assertVerified(subject: Pick<EmailVerificationSubject, 'emailVerifiedAt'>): void {
    if (!subject.emailVerifiedAt) this.emailNotVerified();
  }

  private emailNotVerified(): never {
    throw new AuthenticationException(
      HttpStatus.FORBIDDEN,
      'AUTH.EMAIL_NOT_VERIFIED',
      'AUTH',
      'Bạn cần xác minh Email để sử dụng chức năng này.',
    );
  }
}
