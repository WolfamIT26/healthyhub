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
import { AuthenticationModule } from './presentation/authentication/authentication.module';
import { CommerceDependenciesModule } from './domain/commerce-dependencies/commerce-dependencies.module';
import { CartModule } from './presentation/cart/cart.module';

const runtimeEnvironment = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Ưu tiên file đúng môi trường; `.env` là fallback local cho các biến chưa khai báo.
      envFilePath: [`.env.${runtimeEnvironment}`, '.env'],
      validate: (config) => getValidatedEnvironment(config),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => createTypeOrmOptions(getValidatedEnvironment(process.env)),
    }),
    HealthModule,
    GatewayRegistryModule,
    AuthenticationModule,
    CommerceDependenciesModule,
    CartModule,
  ],
  providers: [AppLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware, RateLimitMiddleware).forRoutes('*');
  }
}
