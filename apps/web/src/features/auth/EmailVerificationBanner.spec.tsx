import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailVerificationBanner } from './EmailVerificationBanner';
import { authApi } from './authApi';
import { useAuth } from './AuthContext';

vi.mock('./AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('./authApi', () => ({ authApi: { resendVerification: vi.fn() } }));

describe('EmailVerificationBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      status: 'authenticated',
      actor: {
        id: '1',
        email: 'pending@example.com',
        fullName: 'Pending Customer',
        roles: ['CUSTOMER'],
        isEmailVerified: false,
      },
      current: null,
      login: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
      hasPermission: vi.fn(),
    });
  });

  it('shows for an unverified Customer, supports resend and can be dismissed temporarily', async () => {
    vi.mocked(authApi.resendVerification).mockResolvedValue({ accepted: true });
    const { unmount } = render(
      <MemoryRouter>
        <EmailVerificationBanner />
      </MemoryRouter>,
    );
    expect(screen.getByText('⚠ Email của bạn chưa được xác minh.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Xác minh ngay' })).toHaveAttribute(
      'href',
      '/verify-email',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Gửi lại Email xác minh' }));
    expect(authApi.resendVerification).toHaveBeenCalledWith({ email: 'pending@example.com' });
    expect(await screen.findByText('Email xác minh đã được gửi lại.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Đóng thông báo xác minh email' }));
    expect(screen.queryByText('⚠ Email của bạn chưa được xác minh.')).not.toBeInTheDocument();

    unmount();
    render(
      <MemoryRouter>
        <EmailVerificationBanner />
      </MemoryRouter>,
    );
    expect(screen.getByText('⚠ Email của bạn chưa được xác minh.')).toBeInTheDocument();
  });

  it('does not show for a verified user', () => {
    vi.mocked(useAuth).mockReturnValue({
      status: 'authenticated',
      actor: {
        id: '1',
        email: 'verified@example.com',
        fullName: 'Verified',
        roles: ['CUSTOMER'],
        isEmailVerified: true,
      },
      current: null,
      login: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
      hasPermission: vi.fn(),
    });
    render(
      <MemoryRouter>
        <EmailVerificationBanner />
      </MemoryRouter>,
    );
    expect(screen.queryByLabelText('Trạng thái xác minh email')).not.toBeInTheDocument();
  });
});
