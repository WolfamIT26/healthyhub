import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import { CurrentAuthentication, Roles } from '../authentication/authentication.decorators';
import { AccessTokenGuard, RolesGuard } from '../authentication/authentication.guards';
import {
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
  UpdateCustomerProfileDto,
} from './customer.dto';
import { CustomerService } from './customer.service';

@ApiTags('Customer')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('me')
export class CustomerController {
  constructor(private readonly customers: CustomerService) {}

  @Get('profile')
  @ApiOperation({ operationId: 'getMeProfile' })
  getProfile(@CurrentAuthentication() auth: AuthenticatedRequestContext) {
    return this.customers.getProfile(auth);
  }

  @Patch('profile')
  @ApiOperation({ operationId: 'patchMeProfile' })
  updateProfile(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() body: UpdateCustomerProfileDto,
  ) {
    return this.customers.updateProfile(auth, idempotencyKey, body);
  }

  @Get('addresses')
  @ApiOperation({ operationId: 'getMeAddresses' })
  listAddresses(@CurrentAuthentication() auth: AuthenticatedRequestContext) {
    return this.customers.listAddresses(auth);
  }

  @Post('addresses')
  @ApiOperation({ operationId: 'postMeAddresses' })
  createAddress(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() body: CreateCustomerAddressDto,
  ) {
    return this.customers.createAddress(auth, idempotencyKey, body);
  }

  @Patch('addresses/:addressId')
  @ApiOperation({ operationId: 'patchMeAddressesAddressId' })
  updateAddress(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('addressId') addressId: string,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() body: UpdateCustomerAddressDto,
  ) {
    return this.customers.updateAddress(auth, addressId, idempotencyKey, body);
  }

  @Delete('addresses/:addressId')
  @ApiOperation({ operationId: 'deleteMeAddressesAddressId' })
  deleteAddress(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Param('addressId') addressId: string,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
  ) {
    return this.customers.deleteAddress(auth, addressId, idempotencyKey);
  }
}
