import { Injectable, LoggerService } from '@nestjs/common';
import { SENSITIVE_LOG_KEYS } from '@healthyhub/shared-config';
import { redactSensitiveKeys } from '@healthyhub/shared-utils';

@Injectable()
export class AppLoggerService implements LoggerService {
  log(message: unknown, context?: string): void {
    this.write('info', message, context);
  }

  error(message: unknown, trace?: string, context?: string): void {
    this.write('error', message, context, trace);
  }

  warn(message: unknown, context?: string): void {
    this.write('warn', message, context);
  }

  debug(message: unknown, context?: string): void {
    this.write('debug', message, context);
  }

  verbose(message: unknown, context?: string): void {
    this.write('verbose', message, context);
  }

  private write(level: string, message: unknown, context?: string, trace?: string): void {
    const payload = {
      level,
      context,
      timestamp: new Date().toISOString(),
      message: redactSensitiveKeys(message, [...SENSITIVE_LOG_KEYS]),
      trace: trace ? '[REDACTED_STACK_AVAILABLE_IN_RUNTIME_LOG]' : undefined,
    };

    const serialized = JSON.stringify(payload);
    if (level === 'error') {
      console.error(serialized);
      return;
    }
    if (level === 'warn') {
      console.warn(serialized);
      return;
    }
    console.log(serialized);
  }
}
