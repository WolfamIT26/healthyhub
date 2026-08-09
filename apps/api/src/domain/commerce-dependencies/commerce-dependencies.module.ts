import { Module } from '@nestjs/common';

import { TypeOrmCustomerOwnerRepository, TypeOrmInventoryAvailabilityRepository, TypeOrmProductCommerceRepository } from '../../data/commerce-dependencies/typeorm-commerce-dependency.repositories';
import { CUSTOMER_OWNER_REPOSITORY, CustomerOwnerResolver } from './customer-owner.resolver';
import { INVENTORY_AVAILABILITY_REPOSITORY, InventoryAvailabilityReader } from './inventory-availability.reader';
import { PRODUCT_COMMERCE_REPOSITORY, ProductCommerceReader } from './product-commerce.reader';

@Module({
  providers: [
    { provide: PRODUCT_COMMERCE_REPOSITORY, useClass: TypeOrmProductCommerceRepository },
    { provide: INVENTORY_AVAILABILITY_REPOSITORY, useClass: TypeOrmInventoryAvailabilityRepository },
    { provide: CUSTOMER_OWNER_REPOSITORY, useClass: TypeOrmCustomerOwnerRepository },
    ProductCommerceReader,
    InventoryAvailabilityReader,
    CustomerOwnerResolver,
  ],
  exports: [ProductCommerceReader, InventoryAvailabilityReader, CustomerOwnerResolver],
})
export class CommerceDependenciesModule {}
