import { Module } from '@nestjs/common';

import { ShippingFoundationModule } from '../../domain/shipping/shipping-foundation.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CartModule } from '../cart/cart.module';
import { CheckoutPreparationService } from './checkout-preparation.service';
import { CheckoutController } from './checkout.controller';

@Module({
  imports: [AuthenticationModule, CartModule, ShippingFoundationModule],
  controllers: [CheckoutController],
  providers: [CheckoutPreparationService],
})
export class CheckoutModule {}
