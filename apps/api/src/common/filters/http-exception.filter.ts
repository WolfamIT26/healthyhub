import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { CONTRACT_VERSION, DEFAULT_LOCALE, DEFAULT_TIMEZONE } from '@healthyhub/shared-config';
import type {
  ApiErrorEnvelope,
  ErrorCategory,
  FieldValidationError,
} from '@healthyhub/shared-types';
import type { Response } from 'express';

import type { HealthyHubEnvironment } from '../../config/environment';
import { AppLoggerService } from '../logging/app-logger.service';
import type { RequestWithContext } from '../types/request-with-context';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly env: HealthyHubEnvironment,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<RequestWithContext>();
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const duration = request.startedAt ? Date.now() - request.startedAt : undefined;
    const message = this.getClientMessage(exceptionResponse, statusCode);
    const typed = this.getTypedError(exceptionResponse);

    const envelope: ApiErrorEnvelope = {
      success: false,
      status: 'error',
      message,
      data: null,
      error: {
        code: typed?.code ?? this.getErrorCode(statusCode),
        category: typed?.category ?? this.getErrorCategory(statusCode),
        message,
        validationErrors: this.getValidationErrors(exceptionResponse),
        retryable:
          typed?.retryable ??
          (statusCode >= 500 || statusCode === HttpStatus.TOO_MANY_REQUESTS),
        details: this.env.app.env === 'production' ? undefined : this.getSafeDetails(exception),
      },
      metadata: {
        timestamp: new Date().toISOString(),
        timezone: DEFAULT_TIMEZONE,
        locale: DEFAULT_LOCALE,
        requestDurationMs: duration,
        path: request.url,
      },
      requestId: request.requestId ?? 'req_unknown',
      traceId: request.traceId ?? request.requestId ?? 'trace_unknown',
      contractVersion: CONTRACT_VERSION,
    };

    this.logger.error(
      {
        event: 'http_exception',
        statusCode,
        path: request.url,
        method: request.method,
        requestId: envelope.requestId,
        traceId: envelope.traceId,
        errorCode: envelope.error.code,
      },
      exception instanceof Error ? exception.stack : undefined,
      'HttpExceptionFilter',
    );

    response.status(statusCode).json(envelope);
  }

  private getTypedError(exceptionResponse: unknown):
    | { code: string; category: ErrorCategory; retryable?: boolean }
    | undefined {
    if (!exceptionResponse || typeof exceptionResponse !== 'object') return undefined;
    const value = exceptionResponse as Record<string, unknown>;
    if (typeof value.code !== 'string' || typeof value.category !== 'string') return undefined;
    return {
      code: value.code,
      category: value.category as ErrorCategory,
      retryable: typeof value.retryable === 'boolean' ? value.retryable : undefined,
    };
  }

  private getClientMessage(exceptionResponse: unknown, statusCode: number): string {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const maybeMessage = (exceptionResponse as { message?: unknown }).message;
      if (typeof maybeMessage === 'string') {
        return maybeMessage;
      }
      if (Array.isArray(maybeMessage)) {
        return 'Dữ liệu gửi lên không hợp lệ.';
      }
    }

    if (statusCode >= 500) {
      return 'Hệ thống đang gặp lỗi. Vui lòng thử lại sau.';
    }

    return 'Yêu cầu không hợp lệ.';
  }

  private getValidationErrors(exceptionResponse: unknown): FieldValidationError[] | undefined {
    if (typeof exceptionResponse !== 'object' || exceptionResponse === null) {
      return undefined;
    }

    const maybeMessage = (exceptionResponse as { message?: unknown }).message;
    if (!Array.isArray(maybeMessage)) {
      return undefined;
    }

    return maybeMessage.map((message, index) => ({
      field: `request.${index}`,
      code: 'VALIDATION_FAILED',
      message: String(message),
      rejectedValuePolicy: 'hidden',
    }));
  }

  private getSafeDetails(exception: unknown): Record<string, unknown> | undefined {
    if (!(exception instanceof Error)) {
      return undefined;
    }

    return {
      name: exception.name,
      message: exception.message,
    };
  }

  private getErrorCode(statusCode: number): string {
    const mapping: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'COMMON_BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'AUTH_UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'PERMISSION_DENIED',
      [HttpStatus.NOT_FOUND]: 'RESOURCE_NOT_FOUND',
      [HttpStatus.CONFLICT]: 'RESOURCE_CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_FAILED',
      [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMIT_EXCEEDED',
      [HttpStatus.BAD_GATEWAY]: 'INTEGRATION_GATEWAY_ERROR',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
    };

    return mapping[statusCode] ?? 'SYSTEM_ERROR';
  }

  private getErrorCategory(statusCode: number): ErrorCategory {
    if (statusCode === HttpStatus.UNAUTHORIZED) return 'AUTH';
    if (statusCode === HttpStatus.FORBIDDEN) return 'PERMISSION';
    if (statusCode === HttpStatus.NOT_FOUND) return 'NOT_FOUND';
    if (statusCode === HttpStatus.CONFLICT) return 'CONFLICT';
    if (statusCode === HttpStatus.TOO_MANY_REQUESTS) return 'RATE_LIMIT';
    if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY || statusCode === HttpStatus.BAD_REQUEST) {
      return 'VALIDATION';
    }
    if (statusCode === HttpStatus.BAD_GATEWAY || statusCode === HttpStatus.SERVICE_UNAVAILABLE) {
      return 'INTEGRATION';
    }
    return 'SYSTEM';
  }
}
