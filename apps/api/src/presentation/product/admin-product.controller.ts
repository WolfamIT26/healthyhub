import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import {
  CurrentAuthentication,
  InternalRoles,
  Permissions,
} from '../authentication/authentication.decorators';
import {
  AccessTokenGuard,
  PermissionsGuard,
  RolesGuard,
} from '../authentication/authentication.guards';
import {
  AdminCreateProductDto,
  AdminProductListQueryDto,
  AdminProductStatusDto,
  AdminProductVersionDto,
  AdminUpdateProductDto,
} from './admin-product.dto';
import { AdminProductService } from './admin-product.service';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard, PermissionsGuard)
@InternalRoles()
@Permissions('products:read')
@Controller('admin/products')
export class AdminProductController {
  constructor(private readonly products: AdminProductService) {}

  @Get()
  @ApiOperation({ operationId: 'getAdminProducts' })
  list(@Query() query: AdminProductListQueryDto) {
    return this.products.list(query);
  }

  @Get('options')
  @ApiOperation({ operationId: 'getAdminProductsOptions' })
  options() {
    return this.products.options();
  }

  @Post()
  @Permissions('products:manage')
  @ApiOperation({ operationId: 'postAdminProducts' })
  create(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Body() body: AdminCreateProductDto,
  ) {
    return this.products.create(auth, body);
  }

  @Get(':productId')
  @ApiOperation({ operationId: 'getAdminProductsProductId' })
  detail(@Param('productId') productId: string) {
    return this.products.detail(productId);
  }

  @Patch(':productId')
  @Permissions('products:manage')
  @ApiOperation({ operationId: 'patchAdminProductsProductId' })
  update(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('productId') productId: string,
    @Body() body: AdminUpdateProductDto,
  ) {
    return this.products.update(auth, productId, body);
  }

  @Patch(':productId/status')
  @Permissions('products:manage')
  @ApiOperation({ operationId: 'patchAdminProductsProductIdStatus' })
  updateStatus(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('productId') productId: string,
    @Body() body: AdminProductStatusDto,
  ) {
    return this.products.updateStatus(auth, productId, body);
  }

  @Delete(':productId')
  @HttpCode(200)
  @Permissions('products:manage')
  @ApiOperation({ operationId: 'deleteAdminProductsProductId' })
  delete(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('productId') productId: string,
    @Query() query: AdminProductVersionDto,
  ) {
    return this.products.delete(auth, productId, query.version);
  }
}
