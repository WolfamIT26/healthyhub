import { Inject, Injectable } from '@nestjs/common';

import {
  ORDER_FULFILLMENT_REPOSITORY,
  type OrderFulfillmentRepository,
  type OrderFulfillmentTransitionResult,
} from '../../data/order/repositories/order-fulfillment.repository';

interface TransitionInput {
  orderId: string;
  actorUserAccountId?: string | null;
  occurredAt?: Date;
  reason?: string;
}

@Injectable()
export class OrderFulfillmentService {
  constructor(
    @Inject(ORDER_FULFILLMENT_REPOSITORY)
    private readonly repository: OrderFulfillmentRepository,
  ) {}

  markShipped(input: TransitionInput): Promise<OrderFulfillmentTransitionResult> {
    return this.repository.transition({
      ...input,
      actorUserAccountId: input.actorUserAccountId ?? null,
      occurredAt: input.occurredAt ?? new Date(),
      type: 'mark_shipped',
      authority: 'shipment_fulfillment',
    });
  }

  markDelivered(input: TransitionInput): Promise<OrderFulfillmentTransitionResult> {
    return this.repository.transition({
      ...input,
      actorUserAccountId: input.actorUserAccountId ?? null,
      occurredAt: input.occurredAt ?? new Date(),
      type: 'mark_delivered',
      authority: 'shipment_fulfillment',
    });
  }

  cancelBeforeShipment(input: TransitionInput & { reason: string }) {
    return this.repository.transition({
      ...input,
      actorUserAccountId: input.actorUserAccountId ?? null,
      occurredAt: input.occurredAt ?? new Date(),
      type: 'cancel_before_shipment',
      authority: 'order_service',
    });
  }

  markReturned(input: TransitionInput & { reason: string }) {
    return this.repository.transition({
      ...input,
      actorUserAccountId: input.actorUserAccountId ?? null,
      occurredAt: input.occurredAt ?? new Date(),
      type: 'mark_returned',
      authority: 'shipment_fulfillment',
    });
  }
}
