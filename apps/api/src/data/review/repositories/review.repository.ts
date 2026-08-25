import type { ReviewIneligibilityReason } from '../../../domain/review/review-eligibility.policy';
import type { ProductReviewEntity } from '../entities';

export interface ReviewFulfillmentEvidence {
  orderStatus: string;
  shippingStatus: string;
  completedAt: Date | null;
  deliveredAt: Date | null;
  hasActiveProduct: boolean;
}

export interface ReviewListRow {
  review: ProductReviewEntity;
  verifiedPurchase: boolean;
  product?: { productId: string; name: string; slug: string };
}

export interface ReviewRatingSummary {
  averageRating: number | null;
  totalReviews: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export type CreateReviewResult =
  | { outcome: 'created' | 'idempotent'; review: ProductReviewEntity }
  | { outcome: 'ineligible'; reason: ReviewIneligibilityReason }
  | { outcome: 'duplicate' };

export interface ReviewRepository {
  listPublic(
    productId: string,
    offset: number,
    limit: number,
  ): Promise<{ rows: ReviewListRow[]; total: number }>;
  summarizePublic(productId: string): Promise<ReviewRatingSummary>;
  listOwned(
    customerProfileId: string,
    productId: string | undefined,
    offset: number,
    limit: number,
  ): Promise<{ rows: ReviewListRow[]; total: number }>;
  findReviewOpportunity(
    customerProfileId: string,
    productId: string,
  ): Promise<{ orderId: string; completedAt: Date } | null>;
  hasReviewIdentity(customerProfileId: string, productId: string): Promise<boolean>;
  create(command: {
    customerProfileId: string;
    actorUserAccountId: string;
    orderId: string;
    productId: string;
    rating: number;
    content: string;
  }): Promise<CreateReviewResult>;
  updateOwned(command: {
    customerProfileId: string;
    actorUserAccountId: string;
    reviewId: string;
    rating?: number;
    content?: string;
  }): Promise<ProductReviewEntity | null>;
  deleteOwned(command: {
    customerProfileId: string;
    actorUserAccountId: string;
    reviewId: string;
  }): Promise<{ found: boolean; reviewId: string }>;
}

export const REVIEW_REPOSITORY = Symbol('REVIEW_REPOSITORY');
