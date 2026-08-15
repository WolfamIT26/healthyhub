import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicDirectoryQueryDto, PublicProductQueryDto } from './product.dto';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('public/products')
export class ProductController {
  constructor(private readonly products: ProductService) {}

  @Get()
  @ApiOperation({ operationId: 'getPublicProducts' })
  list(@Query() query: PublicProductQueryDto) {
    return this.products.list(query);
  }

  @Get('options')
  @ApiOperation({ operationId: 'getPublicProductsOptions' })
  options() {
    return this.products.options();
  }

  @Get(':productId')
  @ApiOperation({ operationId: 'getPublicProductsProductId' })
  detail(@Param('productId') productId: string) {
    return this.products.detail(productId);
  }
}

@ApiTags('Category')
@Controller('public/categories')
export class PublicCategoryController {
  constructor(private readonly products: ProductService) {}

  @Get()
  @ApiOperation({ operationId: 'getPublicCategories' })
  list(@Query() query: PublicDirectoryQueryDto) {
    return this.products.categories(query);
  }

  @Get('tree')
  @ApiOperation({ operationId: 'getPublicCategoriesTree' })
  tree() {
    return this.products.categoryTree();
  }

  @Get(':categoryId')
  @ApiOperation({ operationId: 'getPublicCategoriesCategoryId' })
  detail(@Param('categoryId') categoryId: string) {
    return this.products.category(categoryId);
  }
}

@ApiTags('Brand')
@Controller('public/brands')
export class PublicBrandController {
  constructor(private readonly products: ProductService) {}

  @Get()
  @ApiOperation({ operationId: 'getPublicBrands' })
  list(@Query() query: PublicDirectoryQueryDto) {
    return this.products.brands(query);
  }

  @Get(':brandId')
  @ApiOperation({ operationId: 'getPublicBrandsBrandId' })
  detail(@Param('brandId') brandId: string) {
    return this.products.brand(brandId);
  }
}
