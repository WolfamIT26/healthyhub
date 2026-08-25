import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const POSITIVE_IDENTIFIER = /^[1-9]\d*$/;

export class ReviewPageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize = 10;
}

export class MyReviewQueryDto extends ReviewPageQueryDto {
  @IsOptional()
  @IsString()
  @Matches(POSITIVE_IDENTIFIER)
  productId?: string;
}

export class CreateReviewDto {
  @IsString()
  @Matches(POSITIVE_IDENTIFIER)
  orderId!: string;

  @IsString()
  @Matches(POSITIVE_IDENTIFIER)
  productId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  content!: string;
}

export class UpdateReviewDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  content?: string;
}
