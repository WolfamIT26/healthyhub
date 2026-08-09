import { Inject, Injectable } from '@nestjs/common';

import {
  PaymentProviderNotConfiguredError,
  type PaymentProviderGateway,
} from './payment-provider.gateway';

export const PAYMENT_PROVIDER_GATEWAYS = Symbol('PAYMENT_PROVIDER_GATEWAYS');

@Injectable()
export class PaymentProviderRegistry {
  private readonly gateways: Map<string, PaymentProviderGateway>;

  constructor(@Inject(PAYMENT_PROVIDER_GATEWAYS) gateways: readonly PaymentProviderGateway[]) {
    this.gateways = new Map(
      gateways.map((gateway) => [gateway.providerCode.toLowerCase(), gateway]),
    );
  }

  listConfiguredProviders(): readonly string[] {
    return [...this.gateways.keys()];
  }

  resolve(providerCode: string): PaymentProviderGateway {
    const normalized = providerCode.trim().toLowerCase();
    const gateway = this.gateways.get(normalized);
    if (!gateway) throw new PaymentProviderNotConfiguredError(normalized || 'unknown');
    return gateway;
  }
}
