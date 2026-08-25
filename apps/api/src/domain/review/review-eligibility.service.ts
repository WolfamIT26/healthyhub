import { Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import { CustomerOwnerResolver } from '../commerce-dependencies/customer-owner.resolver';
import {
  REVIEW_ELIGIBILITY_REPOSITORY,
  type ReviewEligibilityRepository,
} from './review-eligibility.repository';
import { ReviewEligibilityPolicy, type ReviewEligibilityResult } from './review-eligibility.policy';

@Injectable()
export class ReviewEligibilityService {
  constructor(
    private readonly owners: CustomerOwnerResolver,
    @Inject(REVIEW_ELIGIBILITY_REPOSITORY)
    private readonly repository: ReviewEligibilityRepository,
    private readonly policy: ReviewEligibilityPolicy,
  ) {}

  async evaluate(
    auth: AuthenticatedRequestContext,
    orderId: string,
    productId: string,
  ): Promise<ReviewEligibilityResult> {
    if (!isPositiveInteger(orderId) || !isPositiveInteger(productId)) {
      return this.policy.evaluate(null);
    }
    const owner = await this.owners.resolve(auth);
    return this.policy.evaluate(
      await this.repository.findEvidence(owner.customerProfileId, orderId, productId),
    );
  }
}

function isPositiveInteger(value: string): boolean {
  return /^[1-9]\d*$/.test(value);
}
