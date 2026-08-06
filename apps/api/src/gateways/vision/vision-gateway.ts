import { Injectable } from '@nestjs/common';

import { BaseGateway } from '../base/base-gateway';

@Injectable()
export class VisionGateway extends BaseGateway {
  protected readonly gatewayName = 'vision' as const;
}
