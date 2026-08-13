import { Injectable } from '@nestjs/common';

export type ExecutablePaymentMethodCode = 'cod' | 'vnpay';

export interface ExecutablePaymentMethod {
  code: ExecutablePaymentMethodCode;
  name: string;
  enabled: boolean;
  captureRequired: boolean;
  initialPaymentStatus: 'pending';
}

export class UnsupportedPaymentMethodError extends Error {
  readonly code = 'PAYMENT_METHOD_UNSUPPORTED';
  constructor(readonly paymentMethod: string) {
    super('Phương thức thanh toán chưa được hỗ trợ.');
  }
}

const COD_METHOD: ExecutablePaymentMethod = Object.freeze({
  code: 'cod',
  name: 'Thanh toán khi nhận hàng',
  enabled: true,
  captureRequired: false,
  initialPaymentStatus: 'pending',
});

const VNPAY_METHOD: ExecutablePaymentMethod = Object.freeze({
  code: 'vnpay',
  name: 'Thanh toán VNPAY',
  enabled: true,
  captureRequired: true,
  initialPaymentStatus: 'pending',
});

@Injectable()
export class PaymentMethodReader {
  listExecutableMethods(): readonly ExecutablePaymentMethod[] {
    return [COD_METHOD, VNPAY_METHOD];
  }

  requireExecutableMethod(code: string): ExecutablePaymentMethod {
    const normalized = code.toLowerCase();
    if (normalized === 'cod') return COD_METHOD;
    if (normalized === 'vnpay') return VNPAY_METHOD;
    throw new UnsupportedPaymentMethodError(code);
  }
}
