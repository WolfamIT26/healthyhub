import { randomUUID } from 'node:crypto';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { REQUEST_HEADER, RESPONSE_HEADER } from '@healthyhub/shared-config';
import type { Response, NextFunction } from 'express';

import type { RequestWithContext } from '../types/request-with-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: RequestWithContext, response: Response, next: NextFunction): void {
    const requestId =
      normalizeHeader(request.headers[REQUEST_HEADER.requestId]) ?? `req_${randomUUID()}`;
    const traceId = normalizeHeader(request.headers[REQUEST_HEADER.traceId]) ?? requestId;

    request.requestId = requestId;
    request.traceId = traceId;
    request.startedAt = Date.now();

    response.setHeader(RESPONSE_HEADER.requestId, requestId);
    response.setHeader(RESPONSE_HEADER.traceId, traceId);

    next();
  }
}

function normalizeHeader(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}
