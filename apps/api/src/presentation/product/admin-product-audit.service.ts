import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '../../common/logging/app-logger.service';

@Injectable()
export class AdminProductAuditService {
  constructor(private readonly logger: AppLoggerService) {}

  emit(
    operation: 'created' | 'updated' | 'status_changed' | 'deleted',
    actorUserAccountId: string,
    productId: string,
    version?: number,
  ) {
    this.logger.log(
      {
        event: `admin_product.${operation}`,
        actorUserAccountId,
        productId,
        version,
      },
      'AdminProductAudit',
    );
  }
}
