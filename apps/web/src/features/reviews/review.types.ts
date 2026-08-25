export interface PublicReview {
  reviewId: string;
  rating: number;
  content: string;
  authorDisplayName: string;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  productId: string;
  averageRating: number | null;
  totalReviews: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface ReviewPage<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface MyReview {
  reviewId: string;
  product: { productId: string; name: string; slug: string };
  rating: number;
  content: string;
  status: 'published' | 'hidden' | 'rejected';
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewEligibility {
  eligible: boolean;
  reason: 'ELIGIBLE' | 'ALREADY_REVIEWED' | 'NO_FULFILLED_PURCHASE';
  orderId: string | null;
  completedAt: string | null;
}

export interface MyReviewsResult extends ReviewPage<MyReview> {
  eligibility: ReviewEligibility | null;
}
