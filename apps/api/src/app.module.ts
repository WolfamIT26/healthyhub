import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { AppLoggerService } from './common/logging/app-logger.service';
import { getValidatedEnvironment } from './config/environment';
import { createTypeOrmOptions } from './database/typeorm.config';
import { GatewayRegistryModule } from './gateways/gateway-registry.module';
import { HealthModule } from './presentation/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => getValidatedEnvironment(config),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => createTypeOrmOptions(getValidatedEnvironment(process.env)),
    }),
    HealthModule,
    GatewayRegistryModule,
  ],
  providers: [AppLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware, RateLimitMiddleware).forRoutes('*');
  }
}
