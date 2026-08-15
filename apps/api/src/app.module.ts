import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { AppLoggerService } from './common/logging/app-logger.service';
import { getValidatedEnvironment, validateEnvironmentSource } from './config/environment';
import { resolveEnvironmentFilePaths } from './config/project-path';
import { createTypeOrmOptions } from './database/typeorm.config';
import { GatewayRegistryModule } from './gateways/gateway-registry.module';
import { HealthModule } from './presentation/health/health.module';
import { AuthenticationModule } from './presentation/authentication/authentication.module';
import { CommerceDependenciesModule } from './domain/commerce-dependencies/commerce-dependencies.module';
import { CartModule } from './presentation/cart/cart.module';
import { PaymentFoundationModule } from './domain/payment/payment-foundation.module';
import { ShippingFoundationModule } from './domain/shipping/shipping-foundation.module';
import { OrderModule } from './presentation/order/order.module';
import { CheckoutModule } from './presentation/checkout/checkout.module';
import { PaymentModule } from './presentation/payment/payment.module';
import { CustomerModule } from './presentation/customer/customer.module';
import { WishlistModule } from './presentation/wishlist/wishlist.module';
import { ProductModule } from './presentation/product/product.module';

const runtimeEnvironment = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Resolve từ workspace root để npm workspace và process chạy trực tiếp dùng cùng nguồn env.
      envFilePath: resolveEnvironmentFilePaths(runtimeEnvironment),
      // Validate qua HealthyHubEnvironment nhưng giữ raw keys để @nestjs/config nạp vào process.env.
      validate: validateEnvironmentSource,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => createTypeOrmOptions(getValidatedEnvironment(process.env)),
    }),
    HealthModule,
    GatewayRegistryModule,
    AuthenticationModule,
    CommerceDependenciesModule,
    CartModule,
    PaymentFoundationModule,
    ShippingFoundationModule,
    OrderModule,
    CheckoutModule,
    PaymentModule,
    CustomerModule,
    WishlistModule,
    ProductModule,
  ],
  providers: [AppLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware, RateLimitMiddleware).forRoutes('*');
  }
}
