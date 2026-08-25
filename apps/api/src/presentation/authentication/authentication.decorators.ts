import { createParamDecorator, SetMetadata, type ExecutionContext } from '@nestjs/common';
import { INTERNAL_ROLE_NAMES, type RoleName } from '@healthyhub/shared-types';

import type { RequestWithContext } from '../../common/types/request-with-context';

export const REQUIRED_ROLES = 'authentication.requiredRoles';
export const REQUIRED_PERMISSIONS = 'authentication.requiredPermissions';
export const Roles = (...roles: RoleName[]) => SetMetadata(REQUIRED_ROLES, roles);
export const InternalRoles = () => Roles(...INTERNAL_ROLE_NAMES);
export const Permissions = (...permissions: string[]) =>
  SetMetadata(REQUIRED_PERMISSIONS, permissions);
export const CurrentAuthentication = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<RequestWithContext>().auth,
);
