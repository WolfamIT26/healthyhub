import type { Request } from 'express';
import type { RoleName } from '@healthyhub/shared-types';

export interface AuthenticatedRequestContext {
  userAccountId: string;
  sessionId: string;
  sessionPublicId: string;
  roles: RoleName[];
  permissionsVersion: number;
}

export interface RequestWithContext extends Request {
  requestId?: string;
  traceId?: string;
  startedAt?: number;
  auth?: AuthenticatedRequestContext;
}
