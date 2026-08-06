import { Injectable } from '@nestjs/common';

import { BaseGateway } from '../base/base-gateway';

@Injectable()
export class StorageGateway extends BaseGateway {
  protected readonly gatewayName = 'storage' as const;
}
