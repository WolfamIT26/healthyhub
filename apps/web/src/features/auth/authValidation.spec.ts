import { describe, expect, it } from 'vitest';

import { validateConfirmation, validateEmail, validateNewPassword } from './authValidation';

describe('Authentication form validation', () => {
  it('rejects invalid registration fields', () => {
    expect(validateEmail('invalid')).toBeTruthy();
    expect(validateNewPassword('short')).toBeTruthy();
    expect(validateConfirmation('valid-password-123', 'different')).toBeTruthy();
  });

  it('accepts the approved password length without composition rules', () => {
    expect(validateNewPassword('mật khẩu dài hợp lệ')).toBeUndefined();
    expect(validateConfirmation('mật khẩu dài hợp lệ', 'mật khẩu dài hợp lệ')).toBeUndefined();
  });
});
