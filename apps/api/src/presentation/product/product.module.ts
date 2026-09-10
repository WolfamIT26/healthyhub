import { Module } from '@nestjs/common';

import {
  ADMIN_PRODUCT_REPOSITORY,
  PUBLIC_CATALOG_REPOSITORY,
  TypeOrmAdminProductRepository,
  TypeOrmPublicProductRepository,
} from '../../data/product/repositories';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AppLoggerService } from '../../common/logging/app-logger.service';
import { AdminProductAuditService } from './admin-product-audit.service';
import { AdminProductController } from './admin-product.controller';
import { AdminProductService } from './admin-product.service';
import {
  ProductController,
  PublicBrandController,
  PublicCategoryController,
} from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [AuthenticationModule],
  controllers: [
    ProductController,
    PublicCategoryController,
    PublicBrandController,
    AdminProductController,
  ],
  providers: [
    { provide: PUBLIC_CATALOG_REPOSITORY, useClass: TypeOrmPublicProductRepository },
    { provide: ADMIN_PRODUCT_REPOSITORY, useClass: TypeOrmAdminProductRepository },
    ProductService,
    AdminProductService,
    AdminProductAuditService,
    AppLoggerService,
  ],
  exports: [ProductService],
})
export class ProductModule {}
