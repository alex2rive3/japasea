import { LoggerService } from '@nestjs/common';

export interface LogContext {
  userId?: string;
  requestId?: string;
  module: string;
  operation: string;
  metadata?: Record<string, any>;
}

export class AppLogger implements LoggerService {
  log(message: string, context?: LogContext) {
    const logEntry = {
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...context,
    };
    console.log(JSON.stringify(logEntry));
  }

  error(message: string, trace?: string, context?: LogContext) {
    const logEntry = {
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      trace,
      ...context,
    };
    console.error(JSON.stringify(logEntry));
  }

  warn(message: string, context?: LogContext) {
    const logEntry = {
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      ...context,
    };
    console.warn(JSON.stringify(logEntry));
  }

  debug(message: string, context?: LogContext) {
    const logEntry = {
      level: 'debug',
      timestamp: new Date().toISOString(),
      message,
      ...context,
    };
    console.debug(JSON.stringify(logEntry));
  }

  verbose(message: string, context?: LogContext) {
    const logEntry = {
      level: 'verbose',
      timestamp: new Date().toISOString(),
      message,
      ...context,
    };
    console.log(JSON.stringify(logEntry));
  }
}
