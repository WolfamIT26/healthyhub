import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderShippingAddressDto {
  @IsString() @MaxLength(255) recipientName!: string;
  @IsString() @MaxLength(32) phone!: string;
  @IsString() @MaxLength(2) countryCode!: string;
  @IsString() @MaxLength(150) provinceCity!: string;
  @IsString() @MaxLength(150) district!: string;
  @IsOptional() @IsString() @MaxLength(150) ward?: string;
  @IsString() @MaxLength(500) addressLine!: string;
  @IsOptional() @IsString() @MaxLength(500) note?: string;
}

export class CreateOrderDto {
  @ValidateNested() @Type(() => OrderShippingAddressDto) shippingAddress!: OrderShippingAddressDto;
  @IsIn(['manual']) shippingMethod!: 'manual';
  @IsString() @MaxLength(64) shippingQuoteReference!: string;
  @IsIn(['cod', 'vnpay']) paymentMethod!: 'cod' | 'vnpay';
}

export class CustomerOrderListQueryDto {
  @Type(() => Number) @IsInt() @Min(1) page = 1;
  @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize = 20;
  @IsOptional() @IsIn(['new', 'confirmed']) orderStatus?: 'new' | 'confirmed';
  @IsOptional()
  @IsIn(['unpaid', 'pending', 'paid', 'failed', 'cancelled'])
  paymentStatus?: 'unpaid' | 'pending' | 'paid' | 'failed' | 'cancelled';
  @IsOptional() @IsIn(['pending']) shippingStatus?: 'pending';
  @IsOptional() @IsISO8601({ strict: true }) dateFrom?: string;
  @IsOptional() @IsISO8601({ strict: true }) dateTo?: string;
}
