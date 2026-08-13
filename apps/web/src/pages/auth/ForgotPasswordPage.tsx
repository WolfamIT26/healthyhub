import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import {
  AuthCard,
  AuthField,
  AuthForm,
  FormAlert,
  StateIllustration,
  SubmitButton,
} from '../../features/auth/AuthCard';
import { authApi } from '../../features/auth/authApi';
import { authAssets } from '../../features/auth/authAssets';
import { validateEmail } from '../../features/auth/authValidation';
import type { NormalizedApiError } from '../../services/api/normalizeApiError';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [error, setError] = useState('');
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateEmail(email);
    setFieldError(validation ?? '');
    setError('');
    setVerificationRequired(false);
    if (validation) return;
    setPending(true);
    try {
      await authApi.forgotPassword({ email: email.trim().toLowerCase() });
      setAccepted(true);
    } catch (caught) {
      const normalized = caught as NormalizedApiError;
      setVerificationRequired(normalized.code === 'AUTH.EMAIL_NOT_VERIFIED');
      setError(normalized.message ?? 'Không thể gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setPending(false);
    }
  }
  return (
    <AuthCard
      title="Quên mật khẩu"
      description="Nhập email để nhận hướng dẫn đặt lại mật khẩu."
      footer={<Link to="/login">Quay lại đăng nhập</Link>}
    >
      {accepted ? (
        <>
          <StateIllustration src={authAssets.successIllustration} alt="Yêu cầu đã được tiếp nhận" />
          <FormAlert tone="success">
            Nếu email hợp lệ, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp
            thư.
          </FormAlert>
        </>
      ) : (
        <AuthForm onSubmit={submit}>
          {error ? <FormAlert>{error}</FormAlert> : null}
          {verificationRequired ? (
            <Link className="font-semibold text-leaf-700 hover:underline" to="/verify-email">
              Gửi lại Email xác minh
            </Link>
          ) : null}
          <AuthField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            error={fieldError}
            autoComplete="email"
          />
          <SubmitButton pending={pending}>Gửi hướng dẫn</SubmitButton>
        </AuthForm>
      )}
    </AuthCard>
  );
}
