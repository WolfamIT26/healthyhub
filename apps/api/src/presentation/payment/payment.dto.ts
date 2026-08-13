import { IsIn, IsString, MaxLength } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  @MaxLength(64)
  orderId!: string;

  @IsIn(['vnpay'])
  paymentMethod!: 'vnpay';
}
