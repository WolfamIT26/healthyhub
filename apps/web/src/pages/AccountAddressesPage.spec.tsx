import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastProvider } from '../components/foundation/ToastProvider';
import { customerApi } from '../features/customer/customerApi';
import { AccountAddressesPage } from './AccountAddressesPage';

vi.mock('../features/customer/customerApi', () => ({
  customerApi: {
    listAddresses: vi.fn(),
    createAddress: vi.fn(),
    updateAddress: vi.fn(),
    deleteAddress: vi.fn(),
  },
  mutationKey: vi.fn(() => 'address-create-test'),
}));

const address = {
  addressId: '11',
  recipientName: 'Nguyễn Văn A',
  phone: '0901234567',
  countryCode: 'VN' as const,
  provinceCity: 'Hồ Chí Minh',
  district: 'Quận 1',
  ward: 'Bến Nghé',
  addressLine: '12 Nguyễn Huệ',
  note: null,
  isDefault: true,
  updatedAt: '2026-08-13T00:00:00.000Z',
};

describe('AccountAddressesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(customerApi.listAddresses).mockResolvedValue([]);
    vi.mocked(customerApi.createAddress).mockResolvedValue(address);
    vi.mocked(customerApi.updateAddress).mockResolvedValue(address);
    vi.mocked(customerApi.deleteAddress).mockResolvedValue({ addressId: '11', deleted: true });
  });

  it('renders loading and the empty Address Book state', async () => {
    renderPage();
    expect(screen.getByLabelText('Đang tải địa chỉ')).toBeInTheDocument();
    expect(await screen.findByText('Chưa có địa chỉ đã lưu')).toBeInTheDocument();
  });

  it('renders persisted responsive address cards and edits the owned address', async () => {
    vi.mocked(customerApi.listAddresses).mockResolvedValue([address]);
    renderPage();
    expect(await screen.findByText('12 Nguyễn Huệ')).toBeInTheDocument();
    expect(screen.getByText('Mặc định')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Chỉnh sửa' }));
    const street = screen.getByLabelText(/Số nhà, tên đường/);
    await userEvent.clear(street);
    await userEvent.type(street, '34 Lê Lợi');
    await userEvent.click(screen.getByRole('button', { name: 'Lưu địa chỉ' }));
    expect(customerApi.updateAddress).toHaveBeenCalledWith(
      '11',
      expect.objectContaining({ addressLine: '34 Lê Lợi', countryCode: 'VN' }),
    );
    expect(await screen.findByText('Đã lưu địa chỉ.')).toBeInTheDocument();
  });

  it('validates and creates an address with an idempotency key', async () => {
    renderPage();
    await screen.findByText('Chưa có địa chỉ đã lưu');
    await userEvent.click(screen.getByRole('button', { name: 'Thêm địa chỉ đầu tiên' }));
    await userEvent.click(screen.getByRole('button', { name: 'Lưu địa chỉ' }));
    expect((await screen.findAllByText('Trường này là bắt buộc.')).length).toBeGreaterThan(0);
    expect(customerApi.createAddress).not.toHaveBeenCalled();

    await userEvent.type(screen.getByLabelText(/Người nhận/), 'Nguyễn Văn A');
    await userEvent.type(screen.getByLabelText(/Số điện thoại/), '0901234567');
    await userEvent.type(screen.getByLabelText(/Tỉnh \/ Thành phố/), 'Hồ Chí Minh');
    await userEvent.type(screen.getByLabelText(/Quận \/ Huyện/), 'Quận 1');
    await userEvent.type(screen.getByLabelText(/Số nhà, tên đường/), '12 Nguyễn Huệ');
    await userEvent.click(screen.getByRole('button', { name: 'Lưu địa chỉ' }));
    expect(customerApi.createAddress).toHaveBeenCalledWith(
      expect.objectContaining({ addressLine: '12 Nguyễn Huệ', countryCode: 'VN' }),
      'address-create-test',
    );
  });

  it('shows retryable errors and confirms a soft delete', async () => {
    vi.mocked(customerApi.listAddresses)
      .mockRejectedValueOnce(new Error('API không phản hồi'))
      .mockResolvedValueOnce([address])
      .mockResolvedValueOnce([]);
    renderPage();
    expect(await screen.findByText('Không thể tải sổ địa chỉ')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
    await screen.findByText('12 Nguyễn Huệ');
    await userEvent.click(screen.getByRole('button', { name: 'Xóa' }));
    await userEvent.click(screen.getByRole('button', { name: 'Xóa địa chỉ' }));
    expect(customerApi.deleteAddress).toHaveBeenCalledWith('11');
    expect(await screen.findByText('Chưa có địa chỉ đã lưu')).toBeInTheDocument();
  });
});

function renderPage() {
  return render(
    <ToastProvider>
      <MemoryRouter>
        <AccountAddressesPage />
      </MemoryRouter>
    </ToastProvider>,
  );
}
