import { HttpException, type HttpStatus } from '@nestjs/common';
import type { ErrorCategory } from '@healthyhub/shared-types';

export class PaymentException extends HttpException {
  constructor(
    status: HttpStatus,
    code: string,
    category: ErrorCategory,
    message: string,
    retryable = false,
  ) {
    super({ code, category, message, retryable }, status);
  }
}
