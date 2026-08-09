import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import { CurrentAuthentication, Roles } from '../authentication/authentication.decorators';
import { AccessTokenGuard, RolesGuard } from '../authentication/authentication.guards';
import { CheckoutPreparationService } from './checkout-preparation.service';
import { ShippingQuoteDto } from './checkout.dto';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller()
export class CheckoutController {
  constructor(private readonly checkout: CheckoutPreparationService) {}

  @Post('shipping/quotes')
  @ApiTags('Shipping')
  @ApiOperation({ operationId: 'postShippingQuotes' })
  quote(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Body() body: ShippingQuoteDto,
  ) {
    return this.checkout.quote(auth, body);
  }
}
