import type { ApiSuccessEnvelope } from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';
import type { ServerCart } from './cart.types';

export const cartApi = {
  get: () =>
    httpClient.get<ApiSuccessEnvelope<ServerCart>>('/cart').then((response) => response.data.data),
  add: (productId: string, quantity: number) =>
    httpClient
      .post<ApiSuccessEnvelope<ServerCart>>('/cart/items', { productId, quantity })
      .then((response) => response.data.data),
  update: (cartItemId: string, quantity: number) =>
    httpClient
      .patch<ApiSuccessEnvelope<ServerCart>>(`/cart/items/${cartItemId}`, { quantity })
      .then((response) => response.data.data),
  remove: (cartItemId: string) =>
    httpClient
      .delete<ApiSuccessEnvelope<ServerCart>>(`/cart/items/${cartItemId}`)
      .then((response) => response.data.data),
};
