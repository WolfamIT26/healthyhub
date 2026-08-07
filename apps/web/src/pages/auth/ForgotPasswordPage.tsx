import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { AuthCard, AuthField, AuthForm, FormAlert, StateIllustration, SubmitButton } from '../../features/auth/AuthCard';
import { authApi } from '../../features/auth/authApi';
import { authAssets } from '../../features/auth/authAssets';
import { validateEmail } from '../../features/auth/authValidation';
import type { NormalizedApiError } from '../../services/api/normalizeApiError';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateEmail(email);
    setFieldError(validation ?? '');
    setError('');
    if (validation) return;
    setPending(true);
    try {
      await authApi.forgotPassword({ email: email.trim().toLowerCase() });
      setAccepted(true);
    } catch (caught) {
      setError((caught as NormalizedApiError).message ?? 'Không thể gửi yêu cầu. Vui lòng thử lại.');
    } finally { setPending(false); }
  }
  return <AuthCard title="Quên mật khẩu" description="Nhập email để nhận hướng dẫn đặt lại mật khẩu." banner={authAssets.heroIllustration} bannerAlt="Không gian chăm sóc sức khỏe HealthyHub" footer={<Link to="/login">Quay lại đăng nhập</Link>}>
    {accepted ? <><StateIllustration src={authAssets.successIllustration} alt="Yêu cầu đã được tiếp nhận" /><FormAlert tone="success">Nếu email hợp lệ, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.</FormAlert></> : <AuthForm onSubmit={submit}>
      {error ? <FormAlert>{error}</FormAlert> : null}
      <AuthField id="email" label="Email" type="email" value={email} onChange={setEmail} error={fieldError} autoComplete="email" />
      <SubmitButton pending={pending}>Gửi hướng dẫn</SubmitButton>
    </AuthForm>}
  </AuthCard>;
}
