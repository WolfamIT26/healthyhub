import type { Request } from 'express';

export interface RequestWithContext extends Request {
  requestId?: string;
  traceId?: string;
  startedAt?: number;
}
