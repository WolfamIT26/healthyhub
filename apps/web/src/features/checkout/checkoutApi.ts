import type { ApiSuccessEnvelope } from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';
import type { CheckoutAddress, CreatedOrder, ShippingQuote } from './checkout.types';

export const checkoutApi = {
  quoteShipping: (address: CheckoutAddress) =>
    httpClient
      .post<ApiSuccessEnvelope<ShippingQuote>>('/shipping/quotes', {
        address,
        shippingMethod: 'manual',
      })
      .then((response) => response.data.data),
  createOrder: (
    address: CheckoutAddress,
    quoteReference: string,
    idempotencyKey: string,
    paymentMethod: 'cod' | 'vnpay',
  ) =>
    httpClient
      .post<ApiSuccessEnvelope<CreatedOrder>>(
        '/orders',
        {
          shippingAddress: address,
          shippingMethod: 'manual',
          shippingQuoteReference: quoteReference,
          paymentMethod,
        },
        { headers: { 'X-Idempotency-Key': idempotencyKey } },
      )
      .then((response) => response.data.data),
};
