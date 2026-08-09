import { Module } from '@nestjs/common';
import { PAYMENT_PROVIDER_EVENT_REPOSITORY, TypeOrmPaymentProviderEventRepository } from '../../data/payment/repositories';

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
    { provide: PAYMENT_PROVIDER_EVENT_REPOSITORY, useClass: TypeOrmPaymentProviderEventRepository },
  ],
  exports: [
    PaymentMethodReader,
    PaymentLifecyclePolicy,
    OrderPaymentMappingPolicy,
    PaymentProviderRegistry,
    PAYMENT_PROVIDER_EVENT_REPOSITORY,
  ],
})
export class PaymentFoundationModule {}
