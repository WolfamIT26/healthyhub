import { HttpException, type HttpStatus } from '@nestjs/common';
import type { ErrorCategory } from '@healthyhub/shared-types';

export class WishlistException extends HttpException {
  constructor(status: HttpStatus, code: string, category: ErrorCategory, message: string) {
    super({ code, category, message, retryable: false }, status);
  }
}
