import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: TypeOrmHealthIndicator,
  ) {}

  @Get('live')
  live() {
    return {
      service: 'healthyhub-api',
      status: 'ok',
      checkedAt: new Date().toISOString(),
    };
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([() => this.database.pingCheck('mysql')]);
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.database.pingCheck('mysql')]);
  }
}
