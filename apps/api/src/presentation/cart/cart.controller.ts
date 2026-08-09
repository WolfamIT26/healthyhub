import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import { CurrentAuthentication, Roles } from '../authentication/authentication.decorators';
import { AccessTokenGuard, RolesGuard } from '../authentication/authentication.guards';
import { AddCartItemDto, UpdateCartItemDto } from './cart.dto';
import { CartService } from './cart.service';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('cart')
export class CartController {
  constructor(private readonly carts: CartService) {}

  @Get()
  @ApiOperation({ operationId: 'getCart' })
  get(@CurrentAuthentication() auth: AuthenticatedRequestContext) {
    return this.carts.get(auth);
  }

  @Post('items')
  @ApiOperation({ operationId: 'postCartItems' })
  add(@CurrentAuthentication() auth: AuthenticatedRequestContext, @Body() body: AddCartItemDto) {
    return this.carts.add(auth, body.productId, body.quantity);
  }

  @Patch('items/:cartItemId')
  @ApiOperation({ operationId: 'patchCartItemsCartItemId' })
  update(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('cartItemId') cartItemId: string,
    @Body() body: UpdateCartItemDto,
  ) {
    return this.carts.update(auth, cartItemId, body.quantity);
  }

  @Delete('items/:cartItemId')
  @HttpCode(200)
  @ApiOperation({ operationId: 'deleteCartItemsCartItemId' })
  remove(@CurrentAuthentication() auth: AuthenticatedRequestContext, @Param('cartItemId') cartItemId: string) {
    return this.carts.remove(auth, cartItemId);
  }
}
