import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';
import { hash, verify, Algorithm } from '@node-rs/argon2';
import { getPasswordPolicyFailure } from '@healthyhub/shared-utils';

import type { HealthyHubEnvironment } from '../../config/environment';

@Injectable()
export class AuthenticationCrypto {
  constructor(@Inject('HealthyHubEnvironment') private readonly env: HealthyHubEnvironment) {}

  normalizeEmail(email: string): string {
    return email.trim().normalize('NFKC').toLocaleLowerCase('en-US');
  }

  assertPasswordAllowed(password: string, email?: string): boolean {
    return getPasswordPolicyFailure(password, email) === undefined;
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, {
      algorithm: Algorithm.Argon2id,
      memoryCost: this.env.authentication.argonMemoryCostKib,
      timeCost: this.env.authentication.argonTimeCost,
      parallelism: this.env.authentication.argonParallelism,
      outputLen: 32,
    });
  }

  verifyPassword(passwordHash: string, password: string): Promise<boolean> {
    return verify(passwordHash, password);
  }

  randomToken(bytes = 32): string {
    return randomBytes(bytes).toString('base64url');
  }

  digest(value: string): string {
    return createHash('sha256').update(value, 'utf8').digest('hex');
  }

  identifierDigest(value: string): string {
    return createHmac('sha256', this.env.authentication.identifierHmacSecret)
      .update(value, 'utf8')
      .digest('hex');
  }

  signCsrf(nonce: string): string {
    const signature = createHmac('sha256', this.env.authentication.csrfSecret)
      .update(nonce, 'utf8')
      .digest('base64url');
    return `${nonce}.${signature}`;
  }

  verifyCsrf(token: string): boolean {
    const separator = token.lastIndexOf('.');
    if (separator <= 0) return false;
    const expected = this.signCsrf(token.slice(0, separator));
    return this.safeEqual(token, expected);
  }

  safeEqual(left: string, right: string): boolean {
    const a = Buffer.from(left);
    const b = Buffer.from(right);
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
