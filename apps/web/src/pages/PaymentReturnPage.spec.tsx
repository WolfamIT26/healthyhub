import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { paymentApi } from '../features/payment/paymentApi';
import { PaymentReturnPage } from './PaymentReturnPage';
import { PaymentResultPage } from './PaymentResultPage';

vi.mock('../features/payment/paymentApi', () => ({
  paymentApi: { processVnpayReturn: vi.fn(), getStatus: vi.fn() },
}));

describe('PaymentReturnPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(paymentApi.processVnpayReturn).mockResolvedValue({
      id: 'pay_1',
      orderId: '91',
      method: 'vnpay',
      status: 'pending',
      amount: '250000.00',
      currency: 'VND',
      providerReference: 'HHVNP-pay_1-test',
      redirectUrl: null,
      updatedAt: new Date('2026-08-10T08:00:00Z').toISOString(),
    });
    vi.mocked(paymentApi.getStatus).mockResolvedValue({
      id: 'pay_1',
      orderId: '91',
      method: 'vnpay',
      status: 'paid',
      amount: '250000.00',
      currency: 'VND',
      providerReference: 'HHVNP-pay_1-test',
      redirectUrl: null,
      updatedAt: new Date('2026-08-10T08:00:00Z').toISOString(),
    });
  });

  it('verifies browser return then routes to the result screen', async () => {
    render(
      <MemoryRouter initialEntries={['/payment/vnpay/return?paymentId=pay_1&vnp_TxnRef=HHVNP-pay_1']}>
        <Routes>
          <Route path="/payment/vnpay/return" element={<PaymentReturnPage />} />
          <Route path="/payment/vnpay/result" element={<PaymentResultPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Thanh toán thành công')).toBeInTheDocument();
    expect(paymentApi.processVnpayReturn).toHaveBeenCalledWith(
      '?paymentId=pay_1&vnp_TxnRef=HHVNP-pay_1',
    );
    expect(paymentApi.getStatus).toHaveBeenCalledWith('pay_1');
  });
});
