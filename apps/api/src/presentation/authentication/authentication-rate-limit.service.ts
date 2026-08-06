import { HttpStatus, Injectable } from '@nestjs/common';

import { AuthenticationCrypto } from './authentication.crypto';
import { AuthenticationException } from './authentication.exception';

interface Bucket {
  count: number;
  resetAt: number;
}

@Injectable()
export class AuthenticationRateLimitService {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly crypto: AuthenticationCrypto) {}

  enforce(scope: string, identifier: string, ip: string | undefined, limit: number, windowMs: number): void {
    const key = this.crypto.identifierDigest(`${scope}:${identifier}:${ip ?? 'unknown'}`);
    const now = Date.now();
    const current = this.buckets.get(key);
    const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
    bucket.count += 1;
    this.buckets.set(key, bucket);
    if (bucket.count > limit) {
      throw new AuthenticationException(
        HttpStatus.TOO_MANY_REQUESTS,
        'RATE_LIMIT.AUTHENTICATION.EXCEEDED',
        'RATE_LIMIT',
        'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
        true,
      );
    }
  }
}
