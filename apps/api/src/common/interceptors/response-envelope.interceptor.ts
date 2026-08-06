import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { CONTRACT_VERSION, DEFAULT_LOCALE, DEFAULT_TIMEZONE } from '@healthyhub/shared-config';
import { isApiEnvelope } from '@healthyhub/shared-utils';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { RequestWithContext } from '../types/request-with-context';

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();

    return next.handle().pipe(
      map((data) => {
        if (isApiEnvelope(data)) {
          return data;
        }

        const duration = request.startedAt ? Date.now() - request.startedAt : undefined;

        return {
          success: true,
          status: 'success',
          message: 'Thao tác thành công.',
          data: data ?? null,
          metadata: {
            timestamp: new Date().toISOString(),
            timezone: DEFAULT_TIMEZONE,
            locale: DEFAULT_LOCALE,
            requestDurationMs: duration,
          },
          requestId: request.requestId ?? 'req_unknown',
          traceId: request.traceId ?? request.requestId ?? 'trace_unknown',
          contractVersion: CONTRACT_VERSION,
        };
      }),
    );
  }
}
