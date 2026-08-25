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
import { CurrentAuthentication, Roles } from '../authentication/authentication.decorators';
import { AccessTokenGuard, RolesGuard } from '../authentication/authentication.guards';
import {
  CreateReviewDto,
  MyReviewQueryDto,
  ReviewPageQueryDto,
  UpdateReviewDto,
} from './review.dto';
import { ReviewService } from './review.service';

@ApiTags('Review')
@Controller('public/products/:productId/reviews')
export class PublicReviewController {
  constructor(private readonly reviews: ReviewService) {}

  @Get()
  @ApiOperation({ operationId: 'getPublicProductsProductIdReviews' })
  list(@Param('productId') productId: string, @Query() query: ReviewPageQueryDto) {
    return this.reviews.listPublic(productId, query);
  }

  @Get('summary')
  @ApiOperation({ operationId: 'getPublicProductsProductIdReviewsSummary' })
  summary(@Param('productId') productId: string) {
    return this.reviews.summary(productId);
  }
}

@ApiTags('Review')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('me/reviews')
export class CustomerReviewController {
  constructor(private readonly reviews: ReviewService) {}

  @Get()
  @ApiOperation({ operationId: 'getMeReviews' })
  listMine(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Query() query: MyReviewQueryDto,
  ) {
    return this.reviews.listMine(auth, query);
  }

  @Post()
  @ApiOperation({ operationId: 'postMeReviews' })
  create(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Body() body: CreateReviewDto,
  ) {
    return this.reviews.create(auth, body);
  }

  @Patch(':reviewId')
  @ApiOperation({ operationId: 'patchMeReviewsReviewId' })
  update(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('reviewId') reviewId: string,
    @Body() body: UpdateReviewDto,
  ) {
    return this.reviews.update(auth, reviewId, body);
  }

  @Delete(':reviewId')
  @HttpCode(200)
  @ApiOperation({ operationId: 'deleteMeReviewsReviewId' })
  delete(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('reviewId') reviewId: string,
  ) {
    return this.reviews.delete(auth, reviewId);
  }
}
