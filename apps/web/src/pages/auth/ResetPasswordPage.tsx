import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { AuthCard, AuthField, AuthForm, FormAlert, StateIllustration, SubmitButton } from '../../features/auth/AuthCard';
import { authApi } from '../../features/auth/authApi';
import { authAssets } from '../../features/auth/authAssets';
import { authSessionStore } from '../../features/auth/authSessionStore';
import { validateConfirmation, validateNewPassword } from '../../features/auth/authValidation';
import type { NormalizedApiError } from '../../services/api/normalizeApiError';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = {
      password: validateNewPassword(password) ?? '',
      confirmation: validateConfirmation(password, confirmation) ?? '',
    };
    setErrors(next);
    setError('');
    if (next.password || next.confirmation) return;
    setPending(true);
    try {
      await authApi.resetPassword({ token, newPassword: password });
      authSessionStore.clear();
      setSuccess(true);
    } catch (caught) {
      setError((caught as NormalizedApiError).message ?? 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
    } finally { setPending(false); }
  }
  if (!token) return <AuthCard title="Liên kết không hợp lệ" description="Liên kết đặt lại mật khẩu thiếu token hoặc đã bị thay đổi."><StateIllustration src={authAssets.maintenanceIllustration} alt="Liên kết cần được làm mới" /><FormAlert>Vui lòng yêu cầu một liên kết đặt lại mật khẩu mới.</FormAlert><div className="auth-footer"><Link to="/forgot-password">Yêu cầu liên kết mới</Link></div></AuthCard>;
  return <AuthCard title="Đặt lại mật khẩu" description="Tạo mật khẩu mới cho tài khoản của bạn." banner={authAssets.loginBanner} bannerAlt="Bảo mật tài khoản HealthyHub" footer={<Link to="/login">Quay lại đăng nhập</Link>}>
    {success ? <><StateIllustration src={authAssets.successIllustration} alt="Đổi mật khẩu thành công" /><FormAlert tone="success">Mật khẩu đã được thay đổi. Tất cả phiên cũ đã đăng xuất. Bạn có thể đăng nhập lại.</FormAlert></> : <AuthForm onSubmit={submit}>
      {error ? <FormAlert>{error}</FormAlert> : null}
      <AuthField id="password" label="Mật khẩu mới" type="password" value={password} onChange={setPassword} error={errors.password} autoComplete="new-password" />
      <AuthField id="confirmation" label="Xác nhận mật khẩu mới" type="password" value={confirmation} onChange={setConfirmation} error={errors.confirmation} autoComplete="new-password" />
      <SubmitButton pending={pending}>Đặt lại mật khẩu</SubmitButton>
    </AuthForm>}
  </AuthCard>;
}
