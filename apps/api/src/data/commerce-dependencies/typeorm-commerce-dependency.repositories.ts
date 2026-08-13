import { Injectable } from '@nestjs/common';
import { DataSource, type Repository } from 'typeorm';

import { CustomerProfileEntity } from '../customer/entities';
import { InventoryItemEntity } from '../inventory/entities';
import { ProductEntity } from '../product/entities';
import type { CustomerOwnerRepository } from '../../domain/commerce-dependencies/customer-owner.resolver';
import type { InventoryAvailabilityRepository } from '../../domain/commerce-dependencies/inventory-availability.reader';
import type { ProductCommerceRepository } from '../../domain/commerce-dependencies/product-commerce.reader';

@Injectable()
export class TypeOrmProductCommerceRepository implements ProductCommerceRepository {
  private readonly products: Repository<ProductEntity>;
  constructor(dataSource: DataSource) {
    this.products = dataSource.getRepository(ProductEntity);
  }
  findById(productId: string) {
    return this.products.findOne({ where: { id: productId } });
  }
}

@Injectable()
export class TypeOrmInventoryAvailabilityRepository implements InventoryAvailabilityRepository {
  private readonly inventory: Repository<InventoryItemEntity>;
  constructor(dataSource: DataSource) {
    this.inventory = dataSource.getRepository(InventoryItemEntity);
  }
  findByProductId(productId: string) {
    return this.inventory.findOne({ where: { productId } });
  }
}

@Injectable()
export class TypeOrmCustomerOwnerRepository implements CustomerOwnerRepository {
  private readonly customers: Repository<CustomerProfileEntity>;
  constructor(dataSource: DataSource) {
    this.customers = dataSource.getRepository(CustomerProfileEntity);
  }
  findActiveByUserAccountId(userAccountId: string) {
    return this.customers.findOne({ where: { userAccountId, customerStatus: 'active' } });
  }
}
