import { getPasswordPolicyFailure } from '@healthyhub/shared-utils';

export interface FormErrors {
  [field: string]: string;
}

export function validateEmail(email: string): string | undefined {
  const normalized = email.trim();
  if (!normalized) return 'Vui lòng nhập email.';
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return 'Email không đúng định dạng.';
  }
  return undefined;
}

export function validateNewPassword(password: string, email?: string): string | undefined {
  const failure = getPasswordPolicyFailure(password, email);
  if (failure === 'length') return 'Mật khẩu phải dài từ 12 đến 128 ký tự.';
  if (failure === 'email') return 'Mật khẩu không được chứa email hoặc phần dễ đoán từ email.';
  if (failure === 'common') return 'Không sử dụng mật khẩu phổ biến.';
  return undefined;
}

export function validateConfirmation(password: string, confirmation: string): string | undefined {
  if (!confirmation) return 'Vui lòng xác nhận mật khẩu.';
  if (password !== confirmation) return 'Mật khẩu xác nhận không khớp.';
  return undefined;
}
