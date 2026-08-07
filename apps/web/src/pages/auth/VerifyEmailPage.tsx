import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { AuthCard, AuthField, AuthForm, FormAlert, StateIllustration, SubmitButton } from '../../features/auth/AuthCard';
import { authApi } from '../../features/auth/authApi';
import { authAssets } from '../../features/auth/authAssets';
import { validateEmail } from '../../features/auth/authValidation';

type VerifyState = 'loading' | 'success' | 'error';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [state, setState] = useState<VerifyState>(token ? 'loading' : 'error');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [resendAccepted, setResendAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!token) return;
    let active = true;
    authApi.verifyEmail({ token }).then(() => { if (active) setState('success'); }).catch(() => { if (active) setState('error'); });
    return () => { active = false; };
  }, [token]);
  async function resend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateEmail(email);
    setEmailError(validation ?? '');
    if (validation) return;
    setPending(true);
    try {
      await authApi.resendVerification({ email: email.trim().toLowerCase() });
      setResendAccepted(true);
    } finally { setPending(false); }
  }
  return <AuthCard title="Xác minh email" description="Hoàn tất xác minh để mở khóa đầy đủ chức năng HealthyHub." footer={<Link to="/login">Đến trang đăng nhập</Link>}>
    {state === 'loading' ? <><StateIllustration src={authAssets.loadingIllustration} alt="Đang xác minh email" /><FormAlert tone="info">Đang xác minh email…</FormAlert></> : null}
    {state === 'success' ? <><StateIllustration src={authAssets.successIllustration} alt="Xác minh email thành công" /><FormAlert tone="success">Email đã được xác minh thành công.</FormAlert></> : null}
    {state === 'error' ? <><StateIllustration src={authAssets.maintenanceIllustration} alt="Liên kết xác minh cần được làm mới" /><FormAlert>Liên kết xác minh không hợp lệ hoặc đã hết hạn.</FormAlert>{resendAccepted ? <FormAlert tone="success">Nếu email hợp lệ, một liên kết xác minh mới đã được gửi.</FormAlert> : <AuthForm onSubmit={resend}><AuthField id="email" label="Email" type="email" value={email} onChange={setEmail} error={emailError} autoComplete="email" /><SubmitButton pending={pending}>Gửi lại email xác minh</SubmitButton></AuthForm>}</> : null}
  </AuthCard>;
}
