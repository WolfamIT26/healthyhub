import { Injectable } from '@nestjs/common';

import type { OrderStatus } from '../../data/order/entities';
import type { ShipmentStatus } from '../../data/shipping/entities';

export const REVIEW_DUPLICATE_IDENTITY = 'order_product' as const;
export const REVIEW_PUBLICATION_DEFAULT = 'published' as const;
export const REVIEW_OWNER_EDIT_LIFECYCLE = 'published_in_place' as const;
export const REVIEW_OWNER_DELETE_LIFECYCLE = 'soft_delete' as const;
export const REVIEW_RETURN_EFFECT = 'revoke_verified_purchase_keep_content' as const;

export interface ReviewEligibilityEvidence {
  orderId: string;
  productId: string;
  orderStatus: OrderStatus;
  shippingStatus: ShipmentStatus;
  completedAt: Date | null;
  deliveredAt: Date | null;
  hasActiveProduct: boolean;
}

export type ReviewIneligibilityReason =
  | 'ORDER_NOT_FOUND_OR_NOT_OWNED'
  | 'PRODUCT_NOT_IN_ORDER'
  | 'FULFILLMENT_NOT_COMPLETED'
  | 'FULFILLMENT_REVOKED';

export type ReviewEligibilityResult =
  | {
      eligible: true;
      duplicateIdentity: typeof REVIEW_DUPLICATE_IDENTITY;
      identity: { orderId: string; productId: string };
    }
  | { eligible: false; reason: ReviewIneligibilityReason };

@Injectable()
export class ReviewEligibilityPolicy {
  evaluate(evidence: ReviewEligibilityEvidence | null): ReviewEligibilityResult {
    if (!evidence) return { eligible: false, reason: 'ORDER_NOT_FOUND_OR_NOT_OWNED' };
    if (!evidence.hasActiveProduct) return { eligible: false, reason: 'PRODUCT_NOT_IN_ORDER' };
    if (
      evidence.orderStatus === 'cancelled' ||
      evidence.orderStatus === 'returned' ||
      evidence.shippingStatus === 'cancelled' ||
      evidence.shippingStatus === 'returned'
    ) {
      return { eligible: false, reason: 'FULFILLMENT_REVOKED' };
    }
    if (
      evidence.orderStatus !== 'completed' ||
      evidence.shippingStatus !== 'delivered' ||
      !evidence.completedAt ||
      !evidence.deliveredAt
    ) {
      return { eligible: false, reason: 'FULFILLMENT_NOT_COMPLETED' };
    }
    return {
      eligible: true,
      duplicateIdentity: REVIEW_DUPLICATE_IDENTITY,
      identity: { orderId: evidence.orderId, productId: evidence.productId },
    };
  }
}
