import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { AuthCard, AuthField, AuthForm, FormAlert, SubmitButton } from '../../features/auth/AuthCard';
import { authApi } from '../../features/auth/authApi';
import { validateConfirmation, validateEmail, validateNewPassword } from '../../features/auth/authValidation';
import type { NormalizedApiError } from '../../services/api/normalizeApiError';

export function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmation: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, setPending] = useState(false);
  const update = (field: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Vui lòng nhập họ và tên.';
    nextErrors.email = validateEmail(form.email) ?? '';
    nextErrors.password = validateNewPassword(form.password) ?? '';
    nextErrors.confirmation = validateConfirmation(form.password, form.confirmation) ?? '';
    Object.keys(nextErrors).forEach((key) => { if (!nextErrors[key]) delete nextErrors[key]; });
    setErrors(nextErrors);
    setError('');
    if (Object.keys(nextErrors).length) return;
    setPending(true);
    try {
      await authApi.register({ fullName: form.fullName.trim(), email: form.email.trim().toLowerCase(), password: form.password });
      setSuccess('Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản.');
    } catch (caught) {
      setError((caught as NormalizedApiError).message ?? 'Không thể đăng ký. Vui lòng thử lại.');
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard title="Tạo tài khoản" description="Đăng ký tài khoản khách hàng HealthyHub." footer={<span>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></span>}>
      {success ? <FormAlert tone="success">{success}</FormAlert> : <AuthForm onSubmit={submit}>
        {error ? <FormAlert>{error}</FormAlert> : null}
        <AuthField id="fullName" label="Họ và tên" value={form.fullName} onChange={update('fullName')} error={errors.fullName} autoComplete="name" />
        <AuthField id="email" label="Email" type="email" value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
        <AuthField id="password" label="Mật khẩu" type="password" value={form.password} onChange={update('password')} error={errors.password} autoComplete="new-password" />
        <p className="field-hint">Dùng 12–128 ký tự. Không sử dụng mật khẩu phổ biến.</p>
        <AuthField id="confirmation" label="Xác nhận mật khẩu" type="password" value={form.confirmation} onChange={update('confirmation')} error={errors.confirmation} autoComplete="new-password" />
        <SubmitButton pending={pending}>Đăng ký</SubmitButton>
      </AuthForm>}
    </AuthCard>
  );
}
