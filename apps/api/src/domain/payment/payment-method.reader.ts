import { Injectable } from '@nestjs/common';

export type ExecutablePaymentMethodCode = 'cod';

export interface ExecutablePaymentMethod {
  code: ExecutablePaymentMethodCode;
  name: string;
  enabled: true;
  captureRequired: false;
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

@Injectable()
export class PaymentMethodReader {
  listExecutableMethods(): readonly ExecutablePaymentMethod[] {
    return [COD_METHOD];
  }

  requireExecutableMethod(code: string): ExecutablePaymentMethod {
    if (code.toLowerCase() !== 'cod') throw new UnsupportedPaymentMethodError(code);
    return COD_METHOD;
  }
}
