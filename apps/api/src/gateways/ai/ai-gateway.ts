import { Injectable } from '@nestjs/common';

import { BaseGateway } from '../base/base-gateway';

@Injectable()
export class AiGateway extends BaseGateway {
  protected readonly gatewayName = 'ai' as const;
}
