import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import {
  REVIEW_REPOSITORY,
  type ReviewListRow,
  type ReviewRepository,
} from '../../data/review/repositories';
import {
  CustomerOwnerResolutionError,
  CustomerOwnerResolver,
} from '../../domain/commerce-dependencies/customer-owner.resolver';
import { ProductCommerceReader } from '../../domain/commerce-dependencies/product-commerce.reader';
import type {
  CreateReviewDto,
  MyReviewQueryDto,
  ReviewPageQueryDto,
  UpdateReviewDto,
} from './review.dto';
import { ReviewException } from './review.exception';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(REVIEW_REPOSITORY) private readonly repository: ReviewRepository,
    private readonly owners: CustomerOwnerResolver,
    private readonly products: ProductCommerceReader,
  ) {}

  async listPublic(productId: string, query: ReviewPageQueryDto) {
    await this.requirePublicProduct(productId);
    const result = await this.repository.listPublic(
      productId,
      (query.page - 1) * query.pageSize,
      query.pageSize,
    );
    return {
      items: result.rows.map((row) => this.publicRead(row)),
      page: query.page,
      pageSize: query.pageSize,
      totalItems: result.total,
      totalPages: result.total === 0 ? 0 : Math.ceil(result.total / query.pageSize),
    };
  }

  async summary(productId: string) {
    await this.requirePublicProduct(productId);
    return { productId, ...(await this.repository.summarizePublic(productId)) };
  }

  async listMine(auth: AuthenticatedRequestContext, query: MyReviewQueryDto) {
    if (query.productId) this.identifier(query.productId);
    const owner = await this.resolveOwner(auth);
    const result = await this.repository.listOwned(
      owner.customerProfileId,
      query.productId,
      (query.page - 1) * query.pageSize,
      query.pageSize,
    );
    let eligibility: {
      eligible: boolean;
      reason: 'ELIGIBLE' | 'ALREADY_REVIEWED' | 'NO_FULFILLED_PURCHASE';
      orderId: string | null;
      completedAt: string | null;
    } | null = null;
    if (query.productId) {
      const opportunity = await this.repository.findReviewOpportunity(
        owner.customerProfileId,
        query.productId,
      );
      if (opportunity) {
        eligibility = {
          eligible: true,
          reason: 'ELIGIBLE',
          orderId: opportunity.orderId,
          completedAt: new Date(opportunity.completedAt).toISOString(),
        };
      } else {
        const used = await this.repository.hasReviewIdentity(
          owner.customerProfileId,
          query.productId,
        );
        eligibility = {
          eligible: false,
          reason: used ? 'ALREADY_REVIEWED' : 'NO_FULFILLED_PURCHASE',
          orderId: null,
          completedAt: null,
        };
      }
    }
    return {
      items: result.rows.map((row) => this.ownerRead(row)),
      eligibility,
      page: query.page,
      pageSize: query.pageSize,
      totalItems: result.total,
      totalPages: result.total === 0 ? 0 : Math.ceil(result.total / query.pageSize),
    };
  }

  async create(auth: AuthenticatedRequestContext, body: CreateReviewDto) {
    const owner = await this.resolveOwner(auth);
    const result = await this.repository.create({
      customerProfileId: owner.customerProfileId,
      actorUserAccountId: auth.userAccountId,
      orderId: body.orderId,
      productId: body.productId,
      rating: body.rating,
      content: body.content,
    });
    if (result.outcome === 'ineligible') {
      throw new ReviewException(
        HttpStatus.FORBIDDEN,
        'PERMISSION.REVIEW.ELIGIBLE_PURCHASE_REQUIRED',
        'PERMISSION',
        'Đơn hàng không cung cấp bằng chứng mua hàng đã giao hợp lệ.',
      );
    }
    if (result.outcome === 'duplicate') {
      throw new ReviewException(
        HttpStatus.CONFLICT,
        'BUSINESS.REVIEW.ALREADY_REVIEWED',
        'BUSINESS',
        'Sản phẩm trong đơn hàng này đã được đánh giá.',
      );
    }
    return { ...this.mutationRead(result.review), created: result.outcome === 'created' };
  }

  async update(auth: AuthenticatedRequestContext, reviewId: string, body: UpdateReviewDto) {
    this.identifier(reviewId);
    if (body.rating === undefined && body.content === undefined) {
      throw new ReviewException(
        HttpStatus.BAD_REQUEST,
        'VALIDATION.REVIEW.EMPTY_UPDATE',
        'VALIDATION',
        'Cần cung cấp rating hoặc nội dung Review.',
      );
    }
    const owner = await this.resolveOwner(auth);
    const review = await this.repository.updateOwned({
      customerProfileId: owner.customerProfileId,
      actorUserAccountId: auth.userAccountId,
      reviewId,
      rating: body.rating,
      content: body.content,
    });
    if (!review) this.notFound();
    return this.mutationRead(review!);
  }

  async delete(auth: AuthenticatedRequestContext, reviewId: string) {
    this.identifier(reviewId);
    const owner = await this.resolveOwner(auth);
    const result = await this.repository.deleteOwned({
      customerProfileId: owner.customerProfileId,
      actorUserAccountId: auth.userAccountId,
      reviewId,
    });
    if (!result.found) this.notFound();
    return { reviewId, deleted: true };
  }

  private publicRead(row: ReviewListRow) {
    return {
      reviewId: row.review.id,
      rating: row.review.rating,
      content: row.review.reviewContent,
      authorDisplayName: 'Khách hàng HealthyHub',
      verifiedPurchase: row.verifiedPurchase,
      createdAt: row.review.submittedAt.toISOString(),
      updatedAt: row.review.updatedAt.toISOString(),
    };
  }

  private ownerRead(row: ReviewListRow) {
    return {
      reviewId: row.review.id,
      product: row.product ?? {
        productId: row.review.productId,
        name: 'Sản phẩm không còn hiển thị',
        slug: '',
      },
      rating: row.review.rating,
      content: row.review.reviewContent,
      status: row.review.reviewStatus,
      verifiedPurchase: row.verifiedPurchase,
      createdAt: row.review.submittedAt.toISOString(),
      updatedAt: row.review.updatedAt.toISOString(),
    };
  }

  private mutationRead(review: ReviewListRow['review']) {
    return {
      reviewId: review.id,
      productId: review.productId,
      rating: review.rating,
      content: review.reviewContent,
      status: review.reviewStatus,
      createdAt: review.submittedAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }

  private async requirePublicProduct(productId: string): Promise<void> {
    this.identifier(productId);
    const product = await this.products.getProductCommerceSnapshot(productId);
    if (!product?.publiclyVisible) {
      throw new ReviewException(
        HttpStatus.NOT_FOUND,
        'NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND',
        'NOT_FOUND',
        'Không tìm thấy sản phẩm công khai.',
      );
    }
  }

  private async resolveOwner(auth: AuthenticatedRequestContext) {
    try {
      return await this.owners.resolve(auth);
    } catch (error) {
      if (error instanceof CustomerOwnerResolutionError) {
        throw new ReviewException(
          HttpStatus.FORBIDDEN,
          'PERMISSION.REVIEW.OWNER_REQUIRED',
          'PERMISSION',
          'Review chỉ dành cho tài khoản Customer hợp lệ.',
        );
      }
      throw error;
    }
  }

  private identifier(value: string): void {
    if (!/^[1-9]\d*$/.test(value)) {
      throw new ReviewException(
        HttpStatus.BAD_REQUEST,
        'VALIDATION.REVIEW.INVALID_IDENTIFIER',
        'VALIDATION',
        'Mã định danh Review không hợp lệ.',
      );
    }
  }

  private notFound(): never {
    throw new ReviewException(
      HttpStatus.NOT_FOUND,
      'NOT_FOUND.REVIEW.REVIEW_NOT_FOUND',
      'NOT_FOUND',
      'Không tìm thấy Review thuộc tài khoản của bạn.',
    );
  }
}
