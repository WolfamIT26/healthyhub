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

  it('rejects email-derived and common passwords case-insensitively', () => {
    const email = 'phamviet@gmail.com';
    expect(validateNewPassword('Secure-phamviet-2026', email)).toMatch(/email/);
    expect(validateNewPassword('Secure-GMAIL-2026', email)).toMatch(/email/);
    expect(validateNewPassword('Secure-phamviet@gmail.com-2026', email)).toMatch(/email/);
    expect(validateNewPassword('PASSWORD1234', email)).toMatch(/phổ biến/);
  });

  it('accepts a strong unrelated password containing an at sign', () => {
    expect(validateNewPassword('River@Stone-2026', 'phamviet@gmail.com')).toBeUndefined();
  });
});
