import { Injectable } from '@nestjs/common';

import { BaseGateway } from '../base/base-gateway';

@Injectable()
export class IntegrationGateway extends BaseGateway {
  protected readonly gatewayName = 'integration' as const;
}
