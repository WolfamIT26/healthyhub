import { useState } from 'react';
import { Link } from 'react-router-dom';

import { authApi } from './authApi';
import { useAuth } from './AuthContext';

export function EmailVerificationBanner() {
  const auth = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [resendState, setResendState] = useState<'idle' | 'pending' | 'accepted' | 'error'>('idle');

  if (dismissed || auth.status !== 'authenticated' || auth.actor?.isEmailVerified !== false)
    return null;

  async function resend() {
    if (!auth.actor || resendState === 'pending') return;
    setResendState('pending');
    try {
      await authApi.resendVerification({ email: auth.actor.email });
      setResendState('accepted');
    } catch {
      setResendState('error');
    }
  }

  return (
    <aside
      className="sticky top-0 z-40 border-b border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 shadow-sm"
      aria-label="Trạng thái xác minh email"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">⚠ Email của bạn chưa được xác minh.</p>
          <p>Một số chức năng sẽ bị giới hạn.</p>
          {import.meta.env.DEV ? (
            <p className="mt-1 text-xs">
              Email service chưa được cấu hình. Có thể Verify bằng Development Tools.
            </p>
          ) : null}
          {resendState === 'accepted' ? (
            <p className="mt-1 text-xs" role="status">
              Email xác minh đã được gửi lại.
            </p>
          ) : null}
          {resendState === 'error' ? (
            <p className="mt-1 text-xs" role="alert">
              Không thể gửi lại email lúc này. Vui lòng thử lại.
            </p>
          ) : null}
        </div>
        <Link
          className="rounded-md bg-leaf-600 px-3 py-2 font-semibold text-white hover:bg-leaf-700"
          to="/verify-email"
        >
          Xác minh ngay
        </Link>
        <button
          className="rounded-md border border-amber-400 px-3 py-2 font-semibold hover:bg-amber-100 disabled:opacity-60"
          type="button"
          disabled={resendState === 'pending'}
          onClick={() => {
            void resend();
          }}
        >
          {resendState === 'pending' ? 'Đang gửi…' : 'Gửi lại Email xác minh'}
        </button>
        <button
          className="rounded-md px-2 py-2 font-semibold hover:bg-amber-100"
          type="button"
          aria-label="Đóng thông báo xác minh email"
          onClick={() => setDismissed(true)}
        >
          Đóng
        </button>
      </div>
    </aside>
  );
}
