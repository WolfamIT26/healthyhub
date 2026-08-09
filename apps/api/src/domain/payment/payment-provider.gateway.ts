import type { PaymentStatus } from './payment-lifecycle.policy';

export interface ProviderPaymentRequest {
  paymentId: string;
  orderId: string;
  amount: string;
  currency: 'VND';
  idempotencyKey: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface ProviderPaymentResult {
  provider: string;
  providerReference: string;
  status: PaymentStatus;
  redirectUrl: string | null;
}

export interface ProviderPaymentQuery {
  provider: string;
  providerReference: string;
  status: PaymentStatus;
}

export interface VerifiedPaymentWebhook {
  provider: string;
  eventId: string;
  eventType: string;
  providerReference: string;
  status: PaymentStatus;
  amount: string;
  currency: 'VND';
  occurredAt: Date;
  verifiedAt: Date;
}

/** Provider adapters own signing, timestamp/replay checks and payload normalization. */
export interface PaymentProviderGateway {
  readonly providerCode: string;
  createPayment(request: ProviderPaymentRequest): Promise<ProviderPaymentResult>;
  queryPayment(providerReference: string): Promise<ProviderPaymentQuery>;
  verifyWebhook(
    rawBody: Buffer,
    headers: Readonly<Record<string, string | string[] | undefined>>,
  ): Promise<VerifiedPaymentWebhook>;
}

export class PaymentProviderNotConfiguredError extends Error {
  readonly code = 'PAYMENT_PROVIDER_NOT_CONFIGURED';
  constructor(readonly providerCode: string) {
    super('Online payment provider chưa được phê duyệt hoặc cấu hình.');
  }
}
