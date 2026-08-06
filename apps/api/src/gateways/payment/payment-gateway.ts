import { Injectable } from '@nestjs/common';

import { BaseGateway } from '../base/base-gateway';

@Injectable()
export class PaymentGateway extends BaseGateway {
  protected readonly gatewayName = 'payment' as const;
}
