import type { ReviewEligibilityEvidence } from './review-eligibility.policy';

export const REVIEW_ELIGIBILITY_REPOSITORY = Symbol('REVIEW_ELIGIBILITY_REPOSITORY');

export interface ReviewEligibilityRepository {
  findEvidence(
    customerProfileId: string,
    orderId: string,
    productId: string,
  ): Promise<ReviewEligibilityEvidence | null>;
}
