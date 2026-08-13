import { CanActivate, ExecutionContext, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { RoleName } from '@healthyhub/shared-types';

import type { HealthyHubEnvironment } from '../../config/environment';
import {
  AUTHENTICATION_REPOSITORY,
  type AuthenticationRepository,
} from '../../data/authentication/repositories';
import type { RequestWithContext } from '../../common/types/request-with-context';
import { AuthenticationCrypto } from './authentication.crypto';
import { REQUIRED_PERMISSIONS, REQUIRED_ROLES } from './authentication.decorators';
import { AuthenticationException } from './authentication.exception';
import { AuthenticationTokenService } from './authentication-token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokens: AuthenticationTokenService,
    @Inject(AUTHENTICATION_REPOSITORY) private readonly repository: AuthenticationRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) this.unauthorized();
    try {
      const claims = await this.tokens.verifyAccessToken(authorization.slice(7));
      const session = await this.repository.findSessionByPublicId(claims.sid);
      const now = new Date();
      if (!session || session.sessionStatus !== 'active' || session.expiresAt <= now)
        this.unauthorized();
      request.auth = {
        userAccountId: claims.sub,
        sessionId: session.id,
        sessionPublicId: session.sessionPublicId,
        roles: claims.roles,
        permissionsVersion: claims.permissionsVersion,
      };
      return true;
    } catch {
      return this.unauthorized();
    }
  }

  private unauthorized(): never {
    throw new AuthenticationException(
      HttpStatus.UNAUTHORIZED,
      'AUTH.AUTHENTICATION.TOKEN_INVALID',
      'AUTH',
      'Phiên xác thực không hợp lệ hoặc đã hết hạn.',
    );
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<RoleName[]>(REQUIRED_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    if (roles.some((role) => request.auth?.roles.includes(role))) return true;
    throw new AuthenticationException(
      HttpStatus.FORBIDDEN,
      'PERMISSION.AUTHENTICATION.DENIED',
      'PERMISSION',
      'Bạn không có quyền thực hiện thao tác này.',
    );
  }
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTHENTICATION_REPOSITORY) private readonly repository: AuthenticationRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(REQUIRED_PERMISSIONS, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    if (!request.auth) return false;
    const effective = await this.repository.getEffectivePermissions(request.auth.userAccountId);
    if (required.every((permission) => effective.includes(permission))) return true;
    throw new AuthenticationException(
      HttpStatus.FORBIDDEN,
      'PERMISSION.AUTHENTICATION.DENIED',
      'PERMISSION',
      'Bạn không có quyền thực hiện thao tác này.',
    );
  }
}

@Injectable()
export class RefreshCsrfGuard implements CanActivate {
  constructor(
    private readonly crypto: AuthenticationCrypto,
    @Inject('HealthyHubEnvironment') private readonly env: HealthyHubEnvironment,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    if (request.headers['x-refresh-token']) return true;
    const header = request.headers['x-csrf-token'];
    const csrf = Array.isArray(header) ? header[0] : header;
    const cookies = parseCookies(request.headers.cookie);
    const origin = request.headers.origin ?? request.headers.referer;
    const originAllowed =
      typeof origin === 'string' &&
      this.env.authentication.allowedOrigins.some(
        (allowed) => origin === allowed || origin.startsWith(`${allowed}/`),
      );
    if (
      !csrf ||
      !cookies.hh_csrf ||
      !this.crypto.safeEqual(csrf, cookies.hh_csrf) ||
      !this.crypto.verifyCsrf(csrf) ||
      !originAllowed
    ) {
      throw new AuthenticationException(
        HttpStatus.FORBIDDEN,
        'PERMISSION.AUTHENTICATION.DENIED',
        'PERMISSION',
        'Yêu cầu làm mới phiên không vượt qua kiểm tra CSRF.',
      );
    }
    return true;
  }
}

export function parseCookies(value?: string): Record<string, string> {
  if (!value) return {};
  return Object.fromEntries(
    value.split(';').map((part) => {
      const separator = part.indexOf('=');
      return [part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1))];
    }),
  );
}
