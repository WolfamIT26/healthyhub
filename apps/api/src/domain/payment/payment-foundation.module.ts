import { Module } from '@nestjs/common';

import { PaymentMethodReader } from './payment-method.reader';

@Module({
  providers: [PaymentMethodReader],
  exports: [PaymentMethodReader],
})
export class PaymentFoundationModule {}
