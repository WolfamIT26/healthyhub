import { Module } from '@nestjs/common';

import { CommerceDependenciesModule } from '../../domain/commerce-dependencies/commerce-dependencies.module';
import { PaymentFoundationModule } from '../../domain/payment/payment-foundation.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [AuthenticationModule, CommerceDependenciesModule, PaymentFoundationModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
