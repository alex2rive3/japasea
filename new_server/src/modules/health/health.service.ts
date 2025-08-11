import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { HealthCheckResponseDto, ServiceStatus } from './dto/health-check-response.dto';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  async getBasicHealth(): Promise<HealthCheckResponseDto> {
    return {
      status: 'healthy',
      timestamp: new Date(),
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  async getDetailedHealth(): Promise<HealthCheckResponseDto> {
    const basicHealth = await this.getBasicHealth();
    const services: Record<string, ServiceStatus> = {};

    // Database health check
    try {
      const dbStart = Date.now();
      await this.mongoConnection.db.admin().ping();
      const dbResponseTime = Date.now() - dbStart;
      
      services.database = {
        name: 'MongoDB',
        status: 'healthy',
        responseTime: dbResponseTime,
        lastChecked: new Date(),
        message: `Connected to ${this.mongoConnection.name}`
      };
    } catch (error) {
      services.database = {
        name: 'MongoDB',
        status: 'unhealthy',
        lastChecked: new Date(),
        message: error.message
      };
    }

    // Memory usage
    const memoryUsage = process.memoryUsage();

    // Determine overall status
    const overallStatus = Object.values(services).some(service => service.status === 'unhealthy')
      ? 'unhealthy'
      : Object.values(services).some(service => service.status === 'degraded')
      ? 'degraded'
      : 'healthy';

    return {
      ...basicHealth,
      status: overallStatus,
      services,
      memory: memoryUsage,
      details: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid
      }
    };
  }

  async getDatabaseHealth(): Promise<HealthCheckResponseDto> {
    const basicHealth = await this.getBasicHealth();
    
    try {
      const dbStart = Date.now();
      await this.mongoConnection.db.admin().ping();
      const dbResponseTime = Date.now() - dbStart;
      
      return {
        ...basicHealth,
        status: 'healthy',
        services: {
          database: {
            name: 'MongoDB',
            status: 'healthy',
            responseTime: dbResponseTime,
            lastChecked: new Date(),
            message: `Connected to ${this.mongoConnection.name}`
          }
        },
        details: {
          connectionState: this.mongoConnection.readyState,
          host: this.mongoConnection.host,
          port: this.mongoConnection.port,
          databaseName: this.mongoConnection.name
        }
      };
    } catch (error) {
      return {
        ...basicHealth,
        status: 'unhealthy',
        services: {
          database: {
            name: 'MongoDB',
            status: 'unhealthy',
            lastChecked: new Date(),
            message: error.message
          }
        }
      };
    }
  }

  async getMemoryUsage(): Promise<HealthCheckResponseDto> {
    const basicHealth = await this.getBasicHealth();
    const memoryUsage = process.memoryUsage();
    
    // Calculate memory usage percentage (assuming 512MB as threshold)
    const memoryThresholdMB = 512 * 1024 * 1024; // 512MB in bytes
    const heapUsedPercentage = (memoryUsage.heapUsed / memoryThresholdMB) * 100;
    
    const memoryStatus: 'healthy' | 'degraded' | 'unhealthy' = 
      heapUsedPercentage > 90 ? 'unhealthy' : 
      heapUsedPercentage > 70 ? 'degraded' : 'healthy';

    return {
      ...basicHealth,
      status: memoryStatus,
      memory: memoryUsage,
      details: {
        heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedPercentage: Math.round(heapUsedPercentage),
        memoryStatus
      }
    };
  }
}
