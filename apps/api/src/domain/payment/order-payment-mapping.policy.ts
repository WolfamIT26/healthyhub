import { Injectable } from '@nestjs/common';
import type { PaymentStatus } from './payment-lifecycle.policy';

export type OrderPaymentEffect = 'none' | 'confirm_if_placed' | 'refund_via_approved_workflow';

@Injectable()
export class OrderPaymentMappingPolicy {
  effectFor(status: PaymentStatus): OrderPaymentEffect {
    if (status === 'paid') return 'confirm_if_placed';
    if (status === 'refunded') return 'refund_via_approved_workflow';
    return 'none';
  }
}
