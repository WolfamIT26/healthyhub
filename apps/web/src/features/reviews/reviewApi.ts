import type { ApiSuccessEnvelope } from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';
import type {
  MyReview,
  MyReviewsResult,
  PublicReview,
  ReviewPage,
  ReviewSummary,
} from './review.types';

export const reviewApi = {
  listPublic: (productId: string, page = 1, pageSize = 5, signal?: AbortSignal) =>
    httpClient
      .get<ApiSuccessEnvelope<ReviewPage<PublicReview>>>(`/public/products/${productId}/reviews`, {
        params: { page, pageSize },
        signal,
      })
      .then((response) => response.data.data),
  summary: (productId: string, signal?: AbortSignal) =>
    httpClient
      .get<ApiSuccessEnvelope<ReviewSummary>>(`/public/products/${productId}/reviews/summary`, {
        signal,
      })
      .then((response) => response.data.data),
  mine: (productId: string, signal?: AbortSignal) =>
    httpClient
      .get<ApiSuccessEnvelope<MyReviewsResult>>('/me/reviews', {
        params: { productId, page: 1, pageSize: 50 },
        signal,
      })
      .then((response) => response.data.data),
  create: (body: { orderId: string; productId: string; rating: number; content: string }) =>
    httpClient
      .post<ApiSuccessEnvelope<MyReview>>('/me/reviews', body)
      .then((response) => response.data.data),
  update: (reviewId: string, body: { rating: number; content: string }) =>
    httpClient
      .patch<ApiSuccessEnvelope<MyReview>>(`/me/reviews/${reviewId}`, body)
      .then((response) => response.data.data),
  delete: (reviewId: string) =>
    httpClient
      .delete<ApiSuccessEnvelope<{ reviewId: string; deleted: true }>>(`/me/reviews/${reviewId}`)
      .then((response) => response.data.data),
};
