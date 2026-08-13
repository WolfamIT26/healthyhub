import { Module } from '@nestjs/common';
import { PAYMENT_PROVIDER_EVENT_REPOSITORY, TypeOrmPaymentProviderEventRepository } from '../../data/payment/repositories';
import { getValidatedEnvironment } from '../../config/environment';
import { VnpayPaymentGateway } from '../../gateways/payment/vnpay-payment.gateway';

import { PaymentMethodReader } from './payment-method.reader';
import { PaymentLifecyclePolicy } from './payment-lifecycle.policy';
import { OrderPaymentMappingPolicy } from './order-payment-mapping.policy';
import { PAYMENT_PROVIDER_GATEWAYS, PaymentProviderRegistry } from './payment-provider.registry';

const environmentProvider = {
  provide: 'HealthyHubEnvironment',
  useFactory: () => getValidatedEnvironment(process.env),
};

const paymentGatewayProvider = {
  provide: PAYMENT_PROVIDER_GATEWAYS,
  inject: ['HealthyHubEnvironment'],
  useFactory: (env: ReturnType<typeof getValidatedEnvironment>) =>
    env.payment.provider === 'vnpay' ? [new VnpayPaymentGateway(env)] : [],
};

@Module({
  providers: [
    environmentProvider,
    PaymentMethodReader,
    PaymentLifecyclePolicy,
    OrderPaymentMappingPolicy,
    paymentGatewayProvider,
    PaymentProviderRegistry,
    { provide: PAYMENT_PROVIDER_EVENT_REPOSITORY, useClass: TypeOrmPaymentProviderEventRepository },
  ],
  exports: [
    'HealthyHubEnvironment',
    PaymentMethodReader,
    PaymentLifecyclePolicy,
    OrderPaymentMappingPolicy,
    PaymentProviderRegistry,
    PAYMENT_PROVIDER_EVENT_REPOSITORY,
  ],
})
export class PaymentFoundationModule {}
