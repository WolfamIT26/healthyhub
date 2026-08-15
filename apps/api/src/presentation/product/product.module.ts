import { Module } from '@nestjs/common';

import {
  PUBLIC_CATALOG_REPOSITORY,
  TypeOrmPublicProductRepository,
} from '../../data/product/repositories';
import {
  ProductController,
  PublicBrandController,
  PublicCategoryController,
} from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController, PublicCategoryController, PublicBrandController],
  providers: [
    { provide: PUBLIC_CATALOG_REPOSITORY, useClass: TypeOrmPublicProductRepository },
    ProductService,
  ],
  exports: [ProductService],
})
export class ProductModule {}
