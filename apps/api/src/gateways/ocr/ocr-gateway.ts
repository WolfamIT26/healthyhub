import { Injectable } from '@nestjs/common';

import { BaseGateway } from '../base/base-gateway';

@Injectable()
export class OcrGateway extends BaseGateway {
  protected readonly gatewayName = 'ocr' as const;
}
