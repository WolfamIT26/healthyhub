import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CONTRACT_VERSION, DEFAULT_LOCALE, DEFAULT_TIMEZONE } from '@healthyhub/shared-config';
import type { PaginatedApiResponse } from '@healthyhub/shared-types';

import type {
  AuthenticatedRequestContext,
  RequestWithContext,
} from '../../common/types/request-with-context';
import { CurrentAuthentication, Roles } from '../authentication/authentication.decorators';
import { AccessTokenGuard, RolesGuard } from '../authentication/authentication.guards';
import { CustomerOrderService, type CustomerOrderListItem } from './customer-order.service';
import { CustomerOrderListQueryDto } from './order.dto';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('me/orders')
export class CustomerOrderController {
  constructor(private readonly orders: CustomerOrderService) {}

  @Get()
  @ApiOperation({ operationId: 'getMeOrders' })
  async list(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Query() query: CustomerOrderListQueryDto,
    @Req() request: RequestWithContext,
  ): Promise<PaginatedApiResponse<CustomerOrderListItem>> {
    const result = await this.orders.list(auth, query);
    return {
      success: true,
      status: 'success',
      message: 'Đã tải danh sách đơn hàng.',
      data: { items: result.items },
      metadata: {
        timestamp: new Date().toISOString(),
        timezone: DEFAULT_TIMEZONE,
        locale: DEFAULT_LOCALE,
        requestDurationMs: request.startedAt ? Date.now() - request.startedAt : undefined,
        pagination: result.pagination,
      },
      requestId: request.requestId ?? 'req_unknown',
      traceId: request.traceId ?? request.requestId ?? 'trace_unknown',
      contractVersion: CONTRACT_VERSION,
    };
  }

  @Get(':orderId')
  @ApiOperation({ operationId: 'getMeOrdersOrderId' })
  detail(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('orderId') orderId: string,
  ) {
    return this.orders.detail(auth, orderId);
  }
}
