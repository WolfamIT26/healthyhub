import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

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
  @IsIn(['cod']) paymentMethod!: 'cod';
}
