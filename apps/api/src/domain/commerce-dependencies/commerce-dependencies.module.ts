import { Module } from '@nestjs/common';

import {
  TypeOrmCustomerOwnerRepository,
  TypeOrmInventoryAvailabilityRepository,
  TypeOrmProductCommerceRepository,
} from '../../data/commerce-dependencies/typeorm-commerce-dependency.repositories';
import { InventoryStockMutationRepository } from '../../data/inventory/repositories';
import { CUSTOMER_OWNER_REPOSITORY, CustomerOwnerResolver } from './customer-owner.resolver';
import {
  INVENTORY_AVAILABILITY_REPOSITORY,
  InventoryAvailabilityReader,
} from './inventory-availability.reader';
import { PRODUCT_COMMERCE_REPOSITORY, ProductCommerceReader } from './product-commerce.reader';

@Module({
  providers: [
    { provide: PRODUCT_COMMERCE_REPOSITORY, useClass: TypeOrmProductCommerceRepository },
    {
      provide: INVENTORY_AVAILABILITY_REPOSITORY,
      useClass: TypeOrmInventoryAvailabilityRepository,
    },
    { provide: CUSTOMER_OWNER_REPOSITORY, useClass: TypeOrmCustomerOwnerRepository },
    ProductCommerceReader,
    InventoryAvailabilityReader,
    InventoryStockMutationRepository,
    CustomerOwnerResolver,
  ],
  exports: [
    ProductCommerceReader,
    InventoryAvailabilityReader,
    InventoryStockMutationRepository,
    CustomerOwnerResolver,
  ],
})
export class CommerceDependenciesModule {}
