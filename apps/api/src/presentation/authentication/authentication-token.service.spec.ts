import { JwtService } from '@nestjs/jwt';
import { describe, expect, it } from 'vitest';

import type { HealthyHubEnvironment } from '../../config/environment';
import { AuthenticationTokenService } from './authentication-token.service';

const env = {
  authentication: {
    jwtSecret: 'jwt-test-secret-with-sufficient-entropy-123456',
    jwtIssuer: 'healthyhub-test',
    jwtAudience: 'healthyhub-test-client',
    accessTokenTtlSeconds: 900,
  },
} as HealthyHubEnvironment;

describe('AuthenticationTokenService', () => {
  const service = new AuthenticationTokenService(new JwtService(), env);

  it('issues minimal approved claims and verifies issuer/audience', async () => {
    const issued = await service.issueAccessToken({
      sub: '101',
      sid: 'session-public-id',
      roles: ['CUSTOMER'],
      permissionsVersion: 1,
    });
    const claims = await service.verifyAccessToken(issued.accessToken);
    expect(claims).toMatchObject({
      sub: '101',
      sid: 'session-public-id',
      roles: ['CUSTOMER'],
      permissionsVersion: 1,
      iss: 'healthyhub-test',
      aud: 'healthyhub-test-client',
    });
    expect(issued.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('rejects a token signed by another key', async () => {
    const token = await new JwtService().signAsync({ sub: '101' }, { secret: 'another-secret' });
    await expect(service.verifyAccessToken(token)).rejects.toBeDefined();
  });
});
