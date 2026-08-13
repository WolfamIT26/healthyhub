import type { PaymentStatus } from './payment-lifecycle.policy';
import type { VerifiedPaymentWebhook } from './payment-provider.gateway';

export type WebhookProcessingStatus =
  'received' | 'processing' | 'processed' | 'rejected' | 'failed';
export interface PaymentWebhookEventRecord {
  id: string;
  provider: string;
  eventId: string;
  eventType: string;
  paymentId: string | null;
  providerReference: string;
  payloadHash: string;
  receivedAt: Date;
  processedAt: Date | null;
  processingStatus: WebhookProcessingStatus;
}
export interface PaymentWebhookEventRepository {
  findByProviderEvent(provider: string, eventId: string): Promise<PaymentWebhookEventRecord | null>;
  recordVerifiedEvent(
    event: VerifiedPaymentWebhook,
    payloadHash: string,
  ): Promise<PaymentWebhookEventRecord>;
  markProcessed(
    id: string,
    paymentId: string,
    status: PaymentStatus,
    processedAt: Date,
  ): Promise<void>;
  markRejected(id: string, processedAt: Date): Promise<void>;
}
export interface AuthoritativePaymentMatch {
  paymentId: string;
  providerReference: string;
  amount: string;
  currency: 'VND';
  status: PaymentStatus;
}
export function webhookMatchesPayment(
  event: VerifiedPaymentWebhook,
  payment: AuthoritativePaymentMatch,
): boolean {
  return (
    event.providerReference === payment.providerReference &&
    event.amount === payment.amount &&
    event.currency === payment.currency
  );
}
