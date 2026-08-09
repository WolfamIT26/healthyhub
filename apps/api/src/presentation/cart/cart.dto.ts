import { IsInt, IsString, Matches, Max, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  @Matches(/^[1-9]\d*$/)
  productId!: string;

  @IsInt()
  @Min(1)
  @Max(9999)
  quantity!: number;
}

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  @Max(9999)
  quantity!: number;
}
