import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import {
  AUTHENTICATION_REPOSITORY,
  type AuthenticationRepository,
} from '../../data/authentication/repositories';
import {
  InvalidShippingCartError,
  ShippingQuoteService,
  ShippingUnavailableError,
  ShippingValidationError,
  UnsupportedShippingMethodError,
} from '../../domain/shipping/shipping-quote.service';
import { EmailVerificationPolicyService } from '../authentication/email-verification-policy.service';
import { CartService } from '../cart/cart.service';
import { OrderException } from '../order/order.exception';
import type { ShippingQuoteDto } from './checkout.dto';

@Injectable()
export class CheckoutPreparationService {
  constructor(
    @Inject(AUTHENTICATION_REPOSITORY) private readonly authentication: AuthenticationRepository,
    private readonly verification: EmailVerificationPolicyService,
    private readonly carts: CartService,
    private readonly shipping: ShippingQuoteService,
  ) {}

  async quote(auth: AuthenticatedRequestContext, input: ShippingQuoteDto) {
    const account = await this.authentication.findAccountById(auth.userAccountId);
    if (!account)
      throw new OrderException(
        HttpStatus.FORBIDDEN,
        'ORDER.ACCESS_DENIED',
        'PERMISSION',
        'Không thể xác định tài khoản Customer.',
      );
    this.verification.assertVerified(account);
    const cart = await this.carts.get(auth);
    if (!cart.items.length || !cart.isValid) {
      throw new OrderException(
        HttpStatus.CONFLICT,
        'ORDER.CART_INVALID',
        'CONFLICT',
        'Giỏ hàng không hợp lệ để tính phí giao hàng.',
      );
    }
    try {
      return this.shipping.quote(input.address, input.shippingMethod, {
        cartId: cart.id,
        subtotal: cart.subtotal,
        itemCount: cart.itemCount,
        isValid: cart.isValid,
      });
    } catch (error) {
      if (
        error instanceof ShippingValidationError ||
        error instanceof ShippingUnavailableError ||
        error instanceof UnsupportedShippingMethodError ||
        error instanceof InvalidShippingCartError
      ) {
        throw new OrderException(
          HttpStatus.UNPROCESSABLE_ENTITY,
          'ORDER.SHIPPING_INVALID',
          'VALIDATION',
          'Địa chỉ hoặc phương thức giao hàng không hợp lệ.',
        );
      }
      throw error;
    }
  }
}
