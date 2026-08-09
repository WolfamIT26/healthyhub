import { Module } from '@nestjs/common';

import { PaymentMethodReader } from './payment-method.reader';
import { PaymentLifecyclePolicy } from './payment-lifecycle.policy';
import { OrderPaymentMappingPolicy } from './order-payment-mapping.policy';
import { PAYMENT_PROVIDER_GATEWAYS, PaymentProviderRegistry } from './payment-provider.registry';

@Module({
  providers: [
    PaymentMethodReader,
    PaymentLifecyclePolicy,
    OrderPaymentMappingPolicy,
    { provide: PAYMENT_PROVIDER_GATEWAYS, useValue: [] },
    PaymentProviderRegistry,
  ],
  exports: [
    PaymentMethodReader,
    PaymentLifecyclePolicy,
    OrderPaymentMappingPolicy,
    PaymentProviderRegistry,
  ],
})
export class PaymentFoundationModule {}
