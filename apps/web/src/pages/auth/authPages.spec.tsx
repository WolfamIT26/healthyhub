import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastProvider } from '../../components/foundation/ToastProvider';
import { useAuth } from '../../features/auth/AuthContext';
import { authApi } from '../../features/auth/authApi';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ResetPasswordPage } from './ResetPasswordPage';

vi.mock('../../features/auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../../features/auth/authApi', () => ({
  authApi: {
    register: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

function renderPage(node: React.ReactNode, entry = '/') {
  return render(
    <ToastProvider>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="*" element={node} />
          <Route path="/customer" element={<p>Customer dashboard</p>} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>,
  );
}

describe('Authentication pages', () => {
  const login = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      status: 'guest',
      actor: null,
      current: null,
      login,
      logout: vi.fn(),
      hasRole: vi.fn(),
      hasPermission: vi.fn(),
    });
  });

  it('logs in successfully and redirects by role', async () => {
    login.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      fullName: 'User',
      roles: ['CUSTOMER'],
    });
    renderPage(<LoginPage />, '/login');
    await userEvent.type(screen.getByLabelText('Email'), 'USER@example.com');
    await userEvent.type(screen.getByLabelText('Mật khẩu'), 'valid-password');
    await userEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }));
    expect(login).toHaveBeenCalledWith('user@example.com', 'valid-password');
    expect(await screen.findByText('Customer dashboard')).toBeInTheDocument();
  });

  it('shows a safe login failure', async () => {
    login.mockRejectedValue({ message: 'Email hoặc mật khẩu không chính xác.' });
    renderPage(<LoginPage />, '/login');
    await userEvent.type(screen.getByLabelText('Email'), 'user@example.com');
    await userEvent.type(screen.getByLabelText('Mật khẩu'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Email hoặc mật khẩu không chính xác.',
    );
  });

  it('blocks invalid registration before calling the API', async () => {
    renderPage(<RegisterPage />, '/register');
    await userEvent.click(screen.getByRole('button', { name: 'Đăng ký' }));
    expect(screen.getByText('Vui lòng nhập họ và tên.')).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it('registers with fullName and shows pending verification success', async () => {
    vi.mocked(authApi.register).mockResolvedValue({
      user: {
        id: '1',
        email: 'new@example.com',
        fullName: 'New User',
        roles: ['CUSTOMER'],
        isEmailVerified: false,
      },
      verification: { status: 'pending', expiresAt: new Date().toISOString() },
    });
    renderPage(<RegisterPage />, '/register');
    await userEvent.type(screen.getByLabelText('Họ và tên'), 'New User');
    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com');
    await userEvent.type(screen.getByLabelText('Mật khẩu'), 'valid-password-123');
    await userEvent.type(screen.getByLabelText('Xác nhận mật khẩu'), 'valid-password-123');
    await userEvent.click(screen.getByRole('button', { name: 'Đăng ký' }));
    expect(authApi.register).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: 'New User' }),
    );
    expect(await screen.findByText(/Vui lòng kiểm tra email/)).toBeInTheDocument();
  });

  it('rejects a registration password derived from the email before calling the API', async () => {
    renderPage(<RegisterPage />, '/register');
    await userEvent.type(screen.getByLabelText('Họ và tên'), 'New User');
    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com');
    await userEvent.type(screen.getByLabelText('Mật khẩu'), 'Secure-NEW-2026');
    await userEvent.type(screen.getByLabelText('Xác nhận mật khẩu'), 'Secure-NEW-2026');
    await userEvent.click(screen.getByRole('button', { name: 'Đăng ký' }));
    expect(
      screen.getByText('Mật khẩu không được chứa email hoặc phần dễ đoán từ email.'),
    ).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it('always shows the generic forgot-password accepted state', async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValue({ accepted: true });
    renderPage(<ForgotPasswordPage />, '/forgot-password');
    await userEvent.type(screen.getByLabelText('Email'), 'unknown@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Gửi hướng dẫn' }));
    expect(await screen.findByText(/Nếu email hợp lệ/)).toBeInTheDocument();
  });

  it('shows verification guidance when forgot-password is blocked', async () => {
    vi.mocked(authApi.forgotPassword).mockRejectedValue({
      code: 'AUTH.EMAIL_NOT_VERIFIED',
      message: 'Tài khoản của bạn chưa được xác minh. Vui lòng xác minh Email trước.',
    });
    renderPage(<ForgotPasswordPage />, '/forgot-password');
    await userEvent.type(screen.getByLabelText('Email'), 'pending@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Gửi hướng dẫn' }));
    expect(await screen.findByText(/Tài khoản của bạn chưa được xác minh/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gửi lại Email xác minh' })).toHaveAttribute(
      'href',
      '/verify-email',
    );
  });

  it('shows invalid reset-token state when URL has no token', () => {
    renderPage(<ResetPasswordPage />, '/reset-password');
    expect(screen.getByRole('heading', { name: 'Liên kết không hợp lệ' })).toBeInTheDocument();
  });

  it('rejects a common reset password before calling the API', async () => {
    renderPage(<ResetPasswordPage />, '/reset-password?token=reset-token');
    await userEvent.type(screen.getByLabelText('Mật khẩu mới'), 'password1234');
    await userEvent.type(screen.getByLabelText('Xác nhận mật khẩu mới'), 'password1234');
    await userEvent.click(screen.getByRole('button', { name: 'Đặt lại mật khẩu' }));
    expect(screen.getByText('Không sử dụng mật khẩu phổ biến.')).toBeInTheDocument();
    expect(authApi.resetPassword).not.toHaveBeenCalled();
  });
});
