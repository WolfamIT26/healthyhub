import { Injectable } from '@nestjs/common';

import { BaseGateway } from '../base/base-gateway';

@Injectable()
export class NotificationGateway extends BaseGateway {
  protected readonly gatewayName = 'notification' as const;
}
