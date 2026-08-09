import { Module } from '@nestjs/common';

import { ORDER_REPOSITORY, TypeOrmOrderRepository } from '../../data/order/repositories';
import { CommerceDependenciesModule } from '../../domain/commerce-dependencies/commerce-dependencies.module';
import { PaymentFoundationModule } from '../../domain/payment/payment-foundation.module';
import { ShippingFoundationModule } from '../../domain/shipping/shipping-foundation.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CartModule } from '../cart/cart.module';
import { OrderCreationService } from './order-creation.service';
import { OrderController } from './order.controller';

@Module({
  imports: [AuthenticationModule, CartModule, CommerceDependenciesModule, PaymentFoundationModule, ShippingFoundationModule],
  controllers: [OrderController],
  providers: [{ provide: ORDER_REPOSITORY, useClass: TypeOrmOrderRepository }, OrderCreationService],
  exports: [OrderCreationService],
})
export class OrderModule {}
