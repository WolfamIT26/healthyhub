import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const PHONE_PATTERN = /^(?:0[0-9]{9,10}|\+84[0-9]{9,10})$/;

export class UpdateCustomerProfileDto {
  @Transform(trim)
  @IsOptional()
  @IsString()
  @Length(1, 255)
  fullName?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Matches(PHONE_PATTERN)
  phone?: string | null;
}

export class CreateCustomerAddressDto {
  @Transform(trim)
  @IsString()
  @Length(1, 255)
  recipientName!: string;

  @Transform(trim)
  @IsString()
  @MaxLength(32)
  @Matches(PHONE_PATTERN)
  phone!: string;

  @Transform(trim)
  @IsString()
  @Equals('VN')
  countryCode!: 'VN';

  @Transform(trim)
  @IsString()
  @Length(1, 150)
  provinceCity!: string;

  @Transform(trim)
  @IsString()
  @Length(1, 150)
  district!: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @Length(1, 150)
  ward?: string;

  @Transform(trim)
  @IsString()
  @Length(1, 500)
  addressLine!: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateCustomerAddressDto {
  @Transform(trim)
  @IsOptional()
  @IsString()
  @Length(1, 255)
  recipientName?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Matches(PHONE_PATTERN)
  phone?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @Equals('VN')
  countryCode?: 'VN';

  @Transform(trim)
  @IsOptional()
  @IsString()
  @Length(1, 150)
  provinceCity?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @Length(1, 150)
  district?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ward?: string | null;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @Length(1, 500)
  addressLine?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string | null;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
