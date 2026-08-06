import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { RoleName } from '@healthyhub/shared-types';

import type { HealthyHubEnvironment } from '../../config/environment';

export interface AccessTokenClaims {
  sub: string;
  sid: string;
  roles: RoleName[];
  permissionsVersion: number;
  iss?: string;
  aud?: string | string[];
  exp?: number;
}

@Injectable()
export class AuthenticationTokenService {
  constructor(
    private readonly jwt: JwtService,
    @Inject('HealthyHubEnvironment') private readonly env: HealthyHubEnvironment,
  ) {}

  async issueAccessToken(claims: Omit<AccessTokenClaims, 'iss' | 'aud' | 'exp'>) {
    const accessToken = await this.jwt.signAsync(claims, {
      secret: this.env.authentication.jwtSecret,
      issuer: this.env.authentication.jwtIssuer,
      audience: this.env.authentication.jwtAudience,
      algorithm: 'HS256',
      expiresIn: this.env.authentication.accessTokenTtlSeconds,
    });
    return {
      accessToken,
      expiresAt: new Date(
        Date.now() + this.env.authentication.accessTokenTtlSeconds * 1000,
      ),
    };
  }

  verifyAccessToken(token: string): Promise<AccessTokenClaims> {
    return this.jwt.verifyAsync<AccessTokenClaims>(token, {
      secret: this.env.authentication.jwtSecret,
      issuer: this.env.authentication.jwtIssuer,
      audience: this.env.authentication.jwtAudience,
      algorithms: ['HS256'],
    });
  }
}
