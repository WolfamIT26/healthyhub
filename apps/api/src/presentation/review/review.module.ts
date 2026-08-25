import { Module } from '@nestjs/common';

import { REVIEW_REPOSITORY, TypeOrmReviewRepository } from '../../data/review/repositories';
import { CommerceDependenciesModule } from '../../domain/commerce-dependencies/commerce-dependencies.module';
import { ReviewFoundationModule } from '../../domain/review/review-foundation.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CustomerReviewController, PublicReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [AuthenticationModule, CommerceDependenciesModule, ReviewFoundationModule],
  controllers: [PublicReviewController, CustomerReviewController],
  providers: [{ provide: REVIEW_REPOSITORY, useClass: TypeOrmReviewRepository }, ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
