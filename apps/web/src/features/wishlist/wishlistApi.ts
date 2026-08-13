import type { ApiSuccessEnvelope } from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';
import type { ServerWishlist, ServerWishlistItem, WishlistMutationResult } from './wishlist.types';

const WISHLIST_PAGE_SIZE = 60;

export const wishlistApi = {
  get: () =>
    httpClient
      .get<ApiSuccessEnvelope<ServerWishlist>>('/me/wishlist', {
        params: { page: 1, pageSize: WISHLIST_PAGE_SIZE },
      })
      .then((response) => response.data.data),
  add: (productId: string) =>
    httpClient
      .post<ApiSuccessEnvelope<ServerWishlistItem>>('/me/wishlist/items', { productId })
      .then((response) => response.data.data),
  remove: (productId: string) =>
    httpClient
      .delete<ApiSuccessEnvelope<WishlistMutationResult>>(`/me/wishlist/products/${productId}`)
      .then((response) => response.data.data),
};
