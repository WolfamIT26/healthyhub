import { HttpStatus } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { Response } from 'express';

import { PaymentController } from './payment.controller';
import { PaymentException } from './payment.exception';

describe('PaymentController', () => {
  it('returns raw VNPAY IPN acknowledgment payload', async () => {
    const payments = {
      processVnpayIpn: vi.fn().mockResolvedValue({ rspCode: '00', message: 'Confirm Success' }),
    } as never;
    const controller = new PaymentController(payments);
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.handleIpn({ vnp_TxnRef: 'HHVNP-1', vnp_Amount: '123400' }, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ RspCode: '00', Message: 'Confirm Success' });
  });

  it.each([
    ['PAYMENT_SIGNATURE_INVALID', '97'],
    ['PAYMENT_AMOUNT_MISMATCH', '04'],
    ['PAYMENT_TRANSACTION_NOT_FOUND', '01'],
  ])('maps %s to VNPAY acknowledgment %s', async (errorCode, rspCode) => {
    const payments = {
      processVnpayIpn: vi.fn().mockRejectedValue(
        new PaymentException(HttpStatus.UNPROCESSABLE_ENTITY, errorCode, 'VALIDATION', 'Provider callback rejected.'),
      ),
    } as never;
    const controller = new PaymentController(payments);
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.handleIpn({}, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ RspCode: rspCode }),
    );
  });
});
