import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastProvider } from '../components/foundation/ToastProvider';
import { customerApi } from '../features/customer/customerApi';
import { AccountProfilePage } from './AccountProfilePage';

vi.mock('../features/customer/customerApi', () => ({
  customerApi: { getProfile: vi.fn(), updateProfile: vi.fn() },
}));

const profile = {
  fullName: 'Nguyễn Văn A',
  email: 'customer@example.test',
  phone: '0901234567',
  updatedAt: '2026-08-13T00:00:00.000Z',
};

describe('AccountProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(customerApi.getProfile).mockResolvedValue(profile);
    vi.mocked(customerApi.updateProfile).mockResolvedValue({
      ...profile,
      fullName: 'Nguyễn Văn B',
    });
  });

  it('renders loading, persisted profile and read-only Authentication email', async () => {
    renderPage();
    expect(screen.getByLabelText('Đang tải hồ sơ')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('Nguyễn Văn A')).toBeInTheDocument();
    expect(screen.getByLabelText('Email đăng nhập')).toHaveAttribute('readonly');
  });

  it('validates and updates only approved profile fields with success feedback', async () => {
    renderPage();
    const name = await screen.findByLabelText(/Họ và tên/);
    await userEvent.clear(name);
    await userEvent.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));
    expect(await screen.findByText('Vui lòng nhập họ và tên.')).toBeInTheDocument();
    expect(customerApi.updateProfile).not.toHaveBeenCalled();

    await userEvent.type(name, 'Nguyễn Văn B');
    await userEvent.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));
    expect(customerApi.updateProfile).toHaveBeenCalledWith({
      fullName: 'Nguyễn Văn B',
      phone: '0901234567',
    });
    expect(await screen.findByText('Cập nhật hồ sơ thành công.')).toBeInTheDocument();
  });

  it('renders a retryable authoritative load error', async () => {
    vi.mocked(customerApi.getProfile).mockRejectedValueOnce(new Error('API không phản hồi'));
    renderPage();
    expect(await screen.findByText('Không thể tải hồ sơ')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
    expect(await screen.findByDisplayValue('Nguyễn Văn A')).toBeInTheDocument();
  });
});

function renderPage() {
  return render(
    <ToastProvider>
      <MemoryRouter>
        <AccountProfilePage />
      </MemoryRouter>
    </ToastProvider>,
  );
}
