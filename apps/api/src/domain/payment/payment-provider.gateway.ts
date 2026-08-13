import type { PaymentStatus } from './payment-lifecycle.policy';

export interface ProviderPaymentRequest {
  paymentId: string;
  orderId: string;
  providerReference: string;
  amount: string;
  currency: 'VND';
  idempotencyKey: string;
  returnUrl: string;
  cancelUrl: string;
  createdAt: Date;
  expiresAt: Date;
  orderInfo: string;
  ipAddress?: string;
}

export interface ProviderPaymentResult {
  provider: string;
  providerReference: string;
  status: PaymentStatus;
  redirectUrl: string | null;
  providerTransactionNo?: string | null;
}

export interface ProviderPaymentQuery {
  provider: string;
  providerReference: string;
  status: PaymentStatus;
  amount: string;
  currency: 'VND';
  providerTransactionNo?: string | null;
  responseCode?: string;
  transactionStatus?: string | null;
  occurredAt?: Date;
}

export interface VerifiedPaymentWebhook {
  provider: string;
  eventId: string;
  eventType: string;
  providerReference: string;
  providerTransactionNo?: string | null;
  responseCode?: string;
  transactionStatus?: string | null;
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
  queryPayment(providerReference: string, transactionDate?: Date): Promise<ProviderPaymentQuery>;
  verifyWebhook(
    rawBody: Buffer,
    headers: Readonly<Record<string, string | string[] | undefined>>,
    query?: Readonly<Record<string, string | string[] | undefined>>,
  ): Promise<VerifiedPaymentWebhook>;
}

export class PaymentProviderNotConfiguredError extends Error {
  readonly code = 'PAYMENT_PROVIDER_NOT_CONFIGURED';
  constructor(readonly providerCode: string) {
    super('Online payment provider chưa được phê duyệt hoặc cấu hình.');
  }
}
