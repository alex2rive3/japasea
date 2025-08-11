import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLogger, LogContext } from '../logging/logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new AppLogger();

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const { statusCode } = res;

      const logContext: LogContext = {
        module: 'HTTP',
        operation: 'request',
        metadata: {
          method,
          url: originalUrl,
          statusCode,
          duration,
          ip,
          userAgent: req.get('User-Agent'),
        },
      };

      if (statusCode >= 400) {
        this.logger.error(
          `${method} ${originalUrl} - ${statusCode} - ${duration}ms`,
          undefined,
          logContext
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl} - ${statusCode} - ${duration}ms`,
          logContext
        );
      }
    });

    next();
  }
}
