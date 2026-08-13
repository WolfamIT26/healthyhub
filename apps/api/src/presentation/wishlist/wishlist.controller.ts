import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import { CurrentAuthentication, Roles } from '../authentication/authentication.decorators';
import { AccessTokenGuard, RolesGuard } from '../authentication/authentication.guards';
import { AddWishlistItemDto, WishlistQueryDto } from './wishlist.dto';
import { WishlistService } from './wishlist.service';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('me/wishlist')
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {}

  @Get()
  @ApiOperation({ operationId: 'getMeWishlist' })
  get(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Query() query: WishlistQueryDto,
  ) {
    return this.wishlist.get(auth, query);
  }

  @Post('items')
  @ApiOperation({ operationId: 'postMeWishlistItems' })
  add(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Body() body: AddWishlistItemDto,
  ) {
    return this.wishlist.add(auth, body.productId);
  }

  @Delete('items/:wishlistItemId')
  @HttpCode(200)
  @ApiOperation({ operationId: 'deleteMeWishlistItemsWishlistItemId' })
  removeItem(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('wishlistItemId') wishlistItemId: string,
  ) {
    return this.wishlist.removeItem(auth, wishlistItemId);
  }

  @Delete('products/:productId')
  @HttpCode(200)
  @ApiOperation({ operationId: 'deleteMeWishlistProductsProductId' })
  removeProduct(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('productId') productId: string,
  ) {
    return this.wishlist.removeProduct(auth, productId);
  }
}
