import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import type { ProductDietaryTag } from '../../data/product/entities';
import type { PublicAvailability, PublicProductSort } from '../../data/product/repositories';

const SORTS: PublicProductSort[] = [
  'featured',
  'newest',
  'name-asc',
  'name-desc',
  'price-asc',
  'price-desc',
];
const AVAILABILITY: PublicAvailability[] = ['in_stock', 'low_stock', 'out_of_stock'];
const DIETARY: ProductDietaryTag[] = [
  'low-sugar',
  'sugar-free',
  'high-protein',
  'vegan',
  'vegetarian',
  'lactose-free',
  'gluten-free',
  'organic',
];

export class PublicProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(60)
  pageSize = 20;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @IsOptional()
  @IsString()
  @MaxLength(191)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(191)
  brand?: string;

  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : String(value).split(',').filter(Boolean),
  )
  @IsArray()
  @ArrayUnique()
  @IsEnum(DIETARY, { each: true })
  dietary: ProductDietaryTag[] = [];

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(AVAILABILITY)
  availability?: PublicAvailability;

  @IsOptional()
  @IsEnum(SORTS)
  sort: PublicProductSort = 'featured';
}

export class PublicDirectoryQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(60)
  pageSize = 20;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
