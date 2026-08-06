import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '../../common/logging/app-logger.service';

@Injectable()
export class AuthenticationAuditService {
  constructor(private readonly logger: AppLoggerService) {}

  emit(event: string, fields: Record<string, unknown> = {}): void {
    this.logger.log({ event: `authentication.${event}`, ...fields }, 'AuthenticationAudit');
  }
}
