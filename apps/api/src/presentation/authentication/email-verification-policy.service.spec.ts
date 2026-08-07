import { describe, expect, it } from 'vitest';

import { EmailVerificationPolicyService } from './email-verification-policy.service';

describe('EmailVerificationPolicyService', () => {
  const policy = new EmailVerificationPolicyService();
  const pending = { userStatus: 'pending' as const, emailVerifiedAt: null };
  const verified = { userStatus: 'active' as const, emailVerifiedAt: new Date() };

  it('allows a pending Customer session but rejects pending Internal login', () => {
    expect(policy.canUseSession(pending, ['CUSTOMER'])).toBe(true);
    expect(() => policy.assertLoginAllowed(pending, ['CUSTOMER'])).not.toThrow();
    expect(() => policy.assertLoginAllowed(pending, ['STAFF'])).toThrowError(/xác minh Email/);
    expect(() => policy.assertLoginAllowed(pending, [])).toThrowError(/xác minh Email/);
  });

  it('blocks sensitive actions for unverified users through one reusable policy', () => {
    for (const _action of ['checkout', 'change-password', 'forgot-password', 'delete-account']) {
      expect(() => policy.assertVerified(pending)).toThrowError(/xác minh Email/);
    }
  });

  it('allows verified Customer and Internal accounts', () => {
    expect(policy.canUseSession(verified, ['CUSTOMER'])).toBe(true);
    expect(policy.canUseSession(verified, ['ADMINISTRATOR'])).toBe(true);
    expect(() => policy.assertVerified(verified)).not.toThrow();
  });
});
