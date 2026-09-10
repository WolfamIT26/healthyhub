import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import {
  ADMIN_PRODUCT_DIETARY_TAGS,
  type AdminProductContentStatus,
  type AdminProductDietaryTag,
  type AdminProductMediaRole,
  type AdminProductStatus,
  type AdminProductVisibility,
} from '@healthyhub/shared-types';

const PRODUCT_STATUSES: AdminProductStatus[] = ['draft', 'active', 'discontinued'];
const PRODUCT_VISIBILITIES: AdminProductVisibility[] = ['public', 'hidden', 'private'];
const CONTENT_STATUSES: AdminProductContentStatus[] = ['draft', 'review', 'published'];
const MEDIA_ROLES: AdminProductMediaRole[] = ['main', 'gallery', 'nutrition'];
const ID_PATTERN = /^[1-9]\d*$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SKU_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{1,63}$/;
const MONEY_PATTERN = /^(?:0|[1-9]\d{0,9})\.\d{2}$/;

export class AdminProductListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @IsOptional()
  @IsEnum(PRODUCT_STATUSES)
  productStatus?: AdminProductStatus;

  @IsOptional()
  @IsEnum(PRODUCT_VISIBILITIES)
  visibility?: AdminProductVisibility;

  @IsOptional()
  @Matches(ID_PATTERN)
  categoryId?: string;

  @IsOptional()
  @Matches(ID_PATTERN)
  brandId?: string;

  @IsOptional()
  @IsEnum(['updated-desc', 'updated-asc', 'name-asc', 'name-desc', 'price-asc', 'price-desc'])
  sort: 'updated-desc' | 'updated-asc' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' =
    'updated-desc';
}

export class AdminProductContentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10_000)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary!: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2_000)
  usageNote!: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2_000)
  storageNote!: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle!: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription!: string | null;

  @IsEnum(CONTENT_STATUSES)
  status!: AdminProductContentStatus;
}

export class AdminProductNutritionDto {
  @IsOptional() @IsString() @MaxLength(100) servingSize!: string | null;
  @IsOptional() @IsString() @MaxLength(100) calories!: string | null;
  @IsOptional() @IsString() @MaxLength(100) protein!: string | null;
  @IsOptional() @IsString() @MaxLength(100) carbohydrates!: string | null;
  @IsOptional() @IsString() @MaxLength(100) fat!: string | null;
  @IsOptional() @IsString() @MaxLength(100) sugar!: string | null;
  @IsOptional() @IsString() @MaxLength(500) note!: string | null;
}

export class AdminProductIngredientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsOptional() @IsString() @MaxLength(2_000) description!: string | null;
  @IsOptional() @IsString() @MaxLength(2_000) nutritionNote!: string | null;
  @IsOptional() @IsString() @MaxLength(500) allergyWarning!: string | null;
}

export class AdminProductMediaDto {
  @Matches(ID_PATTERN)
  mediaAssetId!: string;

  @IsEnum(MEDIA_ROLES)
  role!: AdminProductMediaRole;
}

export class AdminProductAggregateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsString()
  @Matches(SLUG_PATTERN)
  @MaxLength(191)
  slug!: string;

  @IsString()
  @Matches(MONEY_PATTERN)
  price!: string;

  @IsOptional()
  @Matches(ID_PATTERN)
  brandId!: string | null;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ArrayUnique()
  @Matches(ID_PATTERN, { each: true })
  categoryIds!: string[];

  @Matches(ID_PATTERN)
  primaryCategoryId!: string;

  @IsBoolean()
  featured!: boolean;

  @ValidateNested()
  @Type(() => AdminProductContentDto)
  content!: AdminProductContentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminProductNutritionDto)
  nutrition!: AdminProductNutritionDto | null;

  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => AdminProductIngredientDto)
  ingredients!: AdminProductIngredientDto[];

  @IsArray()
  @ArrayUnique()
  @IsEnum(ADMIN_PRODUCT_DIETARY_TAGS, { each: true })
  dietaryTags!: AdminProductDietaryTag[];

  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => AdminProductMediaDto)
  media!: AdminProductMediaDto[];
}

export class AdminCreateProductDto extends AdminProductAggregateDto {
  @IsString()
  @Matches(SKU_PATTERN)
  sku!: string;
}

export class AdminUpdateProductDto extends AdminProductAggregateDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  version!: number;
}

export class AdminProductStatusDto {
  @IsEnum(PRODUCT_STATUSES)
  productStatus!: AdminProductStatus;

  @IsEnum(PRODUCT_VISIBILITIES)
  visibility!: AdminProductVisibility;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  version!: number;
}

export class AdminProductVersionDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  version!: number;
}
