import { Module } from '@nestjs/common';

import { TypeOrmReviewEligibilityRepository } from '../../data/review/repositories';
import { CommerceDependenciesModule } from '../commerce-dependencies/commerce-dependencies.module';
import { REVIEW_ELIGIBILITY_REPOSITORY } from './review-eligibility.repository';
import { ReviewEligibilityPolicy } from './review-eligibility.policy';
import { ReviewEligibilityService } from './review-eligibility.service';

@Module({
  imports: [CommerceDependenciesModule],
  providers: [
    { provide: REVIEW_ELIGIBILITY_REPOSITORY, useClass: TypeOrmReviewEligibilityRepository },
    ReviewEligibilityPolicy,
    ReviewEligibilityService,
  ],
  exports: [ReviewEligibilityPolicy, ReviewEligibilityService],
})
export class ReviewFoundationModule {}
