import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useToast } from '../../components/foundation/ToastProvider';
import { AuthCard, AuthField, AuthForm, FormAlert, SubmitButton } from '../../features/auth/AuthCard';
import { useAuth } from '../../features/auth/AuthContext';
import { validateEmail } from '../../features/auth/authValidation';
import type { NormalizedApiError } from '../../services/api/normalizeApiError';
import { authAssets } from '../../features/auth/authAssets';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const emailError = validateEmail(email);
    if (emailError) nextErrors.email = emailError;
    if (!password) nextErrors['password'] = 'Vui lòng nhập mật khẩu.';
    setErrors(nextErrors);
    setError('');
    if (Object.keys(nextErrors).length) return;
    setPending(true);
    try {
      const actor = await auth.login(email.trim().toLowerCase(), password);
      toast.notify('Đăng nhập thành công.', 'success');
      const intended = (location.state as { from?: string } | null)?.from;
      const fallback = actor.roles.some((role) => role !== 'CUSTOMER') ? '/admin' : '/customer';
      navigate(intended || fallback, { replace: true });
    } catch (caught) {
      setError((caught as NormalizedApiError).message ?? 'Không thể đăng nhập. Vui lòng thử lại.');
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard title="Đăng nhập" description="Chào mừng bạn quay lại HealthyHub." banner={authAssets.loginBanner} bannerAlt="Trợ lý HealthyHub bảo vệ phiên đăng nhập an toàn" footer={<><Link to="/forgot-password">Quên mật khẩu?</Link><span>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></span></>}>
      <AuthForm onSubmit={submit}>
        {error ? <FormAlert>{error}</FormAlert> : null}
        <AuthField id="email" label="Email" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" />
        <AuthField id="password" label="Mật khẩu" type="password" value={password} onChange={setPassword} error={errors.password} autoComplete="current-password" />
        <SubmitButton pending={pending}>Đăng nhập</SubmitButton>
      </AuthForm>
    </AuthCard>
  );
}
