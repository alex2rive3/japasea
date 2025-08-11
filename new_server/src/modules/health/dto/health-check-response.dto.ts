import { ApiProperty } from '@nestjs/swagger';

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  responseTime?: number;
  lastChecked: Date;
}

export class HealthCheckResponseDto {
  @ApiProperty({
    description: 'Overall health status',
    enum: ['healthy', 'unhealthy', 'degraded'],
    example: 'healthy'
  })
  status: 'healthy' | 'unhealthy' | 'degraded';

  @ApiProperty({
    description: 'Timestamp of the health check',
    example: '2025-08-10T21:30:00.000Z'
  })
  timestamp: Date;

  @ApiProperty({
    description: 'Application uptime in milliseconds',
    example: 3600000
  })
  uptime: number;

  @ApiProperty({
    description: 'Application version',
    example: '1.0.0'
  })
  version: string;

  @ApiProperty({
    description: 'Environment',
    example: 'production'
  })
  environment: string;

  @ApiProperty({
    description: 'Individual service statuses',
    type: 'object',
    example: {
      database: {
        name: 'MongoDB',
        status: 'healthy',
        responseTime: 15,
        lastChecked: '2025-08-10T21:30:00.000Z'
      }
    }
  })
  services?: Record<string, ServiceStatus>;

  @ApiProperty({
    description: 'Memory usage information',
    type: 'object',
    example: {
      rss: 45056000,
      heapTotal: 20971520,
      heapUsed: 18725584,
      external: 1089024
    }
  })
  memory?: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };

  @ApiProperty({
    description: 'Additional health information',
    type: 'object',
    required: false
  })
  details?: Record<string, any>;
}
