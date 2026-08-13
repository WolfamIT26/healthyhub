import { Module } from '@nestjs/common';

import { CUSTOMER_REPOSITORY, TypeOrmCustomerRepository } from '../../data/customer/repositories';
import { CommerceDependenciesModule } from '../../domain/commerce-dependencies/commerce-dependencies.module';
import { ShippingFoundationModule } from '../../domain/shipping/shipping-foundation.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [AuthenticationModule, CommerceDependenciesModule, ShippingFoundationModule],
  controllers: [CustomerController],
  providers: [
    { provide: CUSTOMER_REPOSITORY, useClass: TypeOrmCustomerRepository },
    CustomerService,
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
