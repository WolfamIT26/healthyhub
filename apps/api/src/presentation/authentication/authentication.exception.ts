import { HttpException, type HttpStatus } from '@nestjs/common';
import type { AuthenticationErrorCode, ErrorCategory } from '@healthyhub/shared-types';

export class AuthenticationException extends HttpException {
  constructor(
    status: HttpStatus,
    code: AuthenticationErrorCode,
    category: ErrorCategory,
    message: string,
    retryable = false,
  ) {
    super({ code, category, message, retryable }, status);
  }
}
