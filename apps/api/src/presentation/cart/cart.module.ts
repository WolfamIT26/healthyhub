import { Module } from '@nestjs/common';

import { CART_REPOSITORY, TypeOrmCartRepository } from '../../data/cart/repositories';
import { CommerceDependenciesModule } from '../../domain/commerce-dependencies/commerce-dependencies.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [AuthenticationModule, CommerceDependenciesModule],
  controllers: [CartController],
  providers: [
    { provide: CART_REPOSITORY, useClass: TypeOrmCartRepository },
    CartService,
  ],
  exports: [CART_REPOSITORY],
})
export class CartModule {}
