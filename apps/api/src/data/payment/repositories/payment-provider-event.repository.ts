import type { EntityManager } from 'typeorm';

import type { PaymentProviderEventEntity } from '../entities';

export const PAYMENT_PROVIDER_EVENT_REPOSITORY = Symbol('PAYMENT_PROVIDER_EVENT_REPOSITORY');

export interface ClaimPaymentProviderEventInput {
  provider: string;
  providerEventId: string;
  eventType: string;
  providerReference: string;
  payloadHash: string;
  receivedAt: Date;
}

export interface PaymentProviderEventClaim {
  claimed: boolean;
  event: PaymentProviderEventEntity;
}

export interface PaymentProviderEventRepository {
  claim(input: ClaimPaymentProviderEventInput): Promise<PaymentProviderEventClaim>;
  completeWithBusinessEffect(
    eventId: string,
    paymentId: string,
    effect: (manager: EntityManager) => Promise<void>,
  ): Promise<void>;
  markFailed(eventId: string, failureCode: string): Promise<void>;
  markRejected(eventId: string, failureCode: string): Promise<void>;
  findByProviderEvent(
    provider: string,
    providerEventId: string,
  ): Promise<PaymentProviderEventEntity | null>;
}
