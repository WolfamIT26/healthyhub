import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import { CurrentAuthentication, Roles } from '../authentication/authentication.decorators';
import { AccessTokenGuard, RolesGuard } from '../authentication/authentication.guards';
import { CreatePaymentIntentDto } from './payment.dto';
import { PaymentException } from './payment.exception';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller()
export class PaymentController {
  constructor(private readonly payments: PaymentService) {}

  @Get('payments/methods')
  @ApiOperation({ operationId: 'getPaymentsMethods' })
  listMethods() {
    return this.payments.listMethods();
  }

  @Post('payments/intents')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  @ApiOperation({ operationId: 'postPaymentsIntents' })
  createIntent(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() body: CreatePaymentIntentDto,
    @Req() request: Request,
  ) {
    return this.payments.createIntent(auth, idempotencyKey, body, request.ip);
  }

  @Get('payments/:paymentId')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  @ApiOperation({ operationId: 'getPaymentsPaymentId' })
  getStatus(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('paymentId') paymentId: string,
  ) {
    return this.payments.getStatus(auth, paymentId);
  }

  @Get('payments/vnpay/return')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  @ApiOperation({ operationId: 'getPaymentsVnpayReturn' })
  async handleReturn(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Query() query: Record<string, string | string[] | undefined>,
  ) {
    return this.payments.processVnpayReturn(auth, query);
  }

  @Get('webhooks/payment/vnpay')
  @ApiOperation({ operationId: 'getWebhooksPaymentVnpay' })
  async handleIpn(
    @Query() query: Record<string, string | string[] | undefined>,
    @Res() response: Response,
  ): Promise<void> {
    try {
      const result = await this.payments.processVnpayIpn(query);
      response.status(200).json({ RspCode: result.rspCode, Message: result.message });
    } catch (error) {
      response.status(200).json(mapVnpayAck(error));
    }
  }
}

function mapVnpayAck(error: unknown) {
  if (error instanceof PaymentException) {
    const code = extractCode(error);
    return { RspCode: code, Message: error.message };
  }
  if (error instanceof Error) {
    return { RspCode: '99', Message: error.message };
  }
  return { RspCode: '99', Message: 'Unknown error' };
}

function extractCode(error: PaymentException): string {
  const response = error.getResponse();
  if (typeof response === 'object' && response !== null && 'code' in response) {
    const code = (response as Record<string, unknown>).code;
    if (typeof code === 'string') return mapCode(code);
  }
  return '99';
}

function mapCode(code: string): string {
  if (code === 'PAYMENT_SIGNATURE_INVALID') return '97';
  if (code === 'PAYMENT_AMOUNT_MISMATCH') return '04';
  if (code === 'PAYMENT_TRANSACTION_NOT_FOUND') return '01';
  if (code === 'PAYMENT_ALREADY_COMPLETED') return '02';
  if (code === 'PAYMENT_PROVIDER_UNAVAILABLE') return '99';
  return '99';
}
