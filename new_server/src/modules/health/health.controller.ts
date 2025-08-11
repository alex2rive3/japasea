import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckResponseDto } from './dto/health-check-response.dto';
import { Public } from '../../shared';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ 
    summary: 'Basic health check',
    description: 'Returns basic application health status'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Application is healthy',
    type: HealthCheckResponseDto
  })
  async checkHealth(): Promise<HealthCheckResponseDto> {
    return this.healthService.getBasicHealth();
  }

  @Public()
  @Get('detailed')
  @ApiOperation({ 
    summary: 'Detailed health check',
    description: 'Returns detailed health status including database and external services'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Detailed health information',
    type: HealthCheckResponseDto
  })
  async checkDetailedHealth(): Promise<HealthCheckResponseDto> {
    return this.healthService.getDetailedHealth();
  }

  @Public()
  @Get('database')
  @ApiOperation({ 
    summary: 'Database health check',
    description: 'Returns database connection status'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Database health status',
    type: HealthCheckResponseDto
  })
  async checkDatabaseHealth(): Promise<HealthCheckResponseDto> {
    return this.healthService.getDatabaseHealth();
  }

  @Public()
  @Get('memory')
  @ApiOperation({ 
    summary: 'Memory usage check',
    description: 'Returns current memory usage information'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Memory usage information',
    type: HealthCheckResponseDto
  })
  async checkMemoryUsage(): Promise<HealthCheckResponseDto> {
    return this.healthService.getMemoryUsage();
  }
}
