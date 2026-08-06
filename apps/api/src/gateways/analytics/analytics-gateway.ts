import { Injectable } from '@nestjs/common';

import { BaseGateway } from '../base/base-gateway';

@Injectable()
export class AnalyticsGateway extends BaseGateway {
  protected readonly gatewayName = 'analytics' as const;
}
