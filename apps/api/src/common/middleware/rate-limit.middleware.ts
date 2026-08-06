import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import type { Response, NextFunction } from 'express';

import { getValidatedEnvironment } from '../../config/environment';
import type { RequestWithContext } from '../types/request-with-context';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  use(request: RequestWithContext, response: Response, next: NextFunction): void {
    const env = getValidatedEnvironment(process.env);
    const key = this.createKey(request);
    const now = Date.now();
    const currentBucket = buckets.get(key);
    const bucket =
      currentBucket && currentBucket.resetAt > now
        ? currentBucket
        : {
            count: 0,
            resetAt: now + env.security.rateLimitTtlMs,
          };

    bucket.count += 1;
    buckets.set(key, bucket);

    response.setHeader('X-RateLimit-Limit', String(env.security.rateLimitLimit));
    response.setHeader(
      'X-RateLimit-Remaining',
      String(Math.max(0, env.security.rateLimitLimit - bucket.count)),
    );
    response.setHeader('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > env.security.rateLimitLimit) {
      throw new HttpException(
        'Vượt giới hạn request. Vui lòng thử lại sau.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }

  private createKey(request: RequestWithContext): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    return forwardedIp ?? request.ip ?? request.socket.remoteAddress ?? 'unknown';
  }
}
