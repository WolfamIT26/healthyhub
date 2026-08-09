import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import { CurrentAuthentication, Roles } from '../authentication/authentication.decorators';
import { AccessTokenGuard, RolesGuard } from '../authentication/authentication.guards';
import { OrderCreationService } from './order-creation.service';
import { CreateOrderDto } from './order.dto';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('orders')
export class OrderController {
  constructor(private readonly orders: OrderCreationService) {}

  @Post()
  @ApiOperation({ operationId: 'postOrders' })
  create(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() body: CreateOrderDto,
  ) {
    return this.orders.createOrderFromCheckout(auth, idempotencyKey, body);
  }
}
