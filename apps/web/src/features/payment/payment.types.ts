export type PaymentStatus =
  'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded' | 'cancelled';

export interface PaymentMethodReadModel {
  code: 'cod' | 'vnpay';
  name: string;
  enabled: boolean;
  captureRequired: boolean;
  initialPaymentStatus: 'pending';
}

export interface PaymentSummary {
  id: string;
  orderId: string;
  method: 'cod' | 'vnpay';
  status: PaymentStatus;
  amount: string;
  currency: 'VND';
  providerReference: string | null;
  redirectUrl?: string | null;
  updatedAt: string;
}

export interface CreatePaymentIntentInput {
  orderId: string;
  paymentMethod: 'vnpay';
}

export type PaymentUiState =
  'idle' | 'creating' | 'redirect_required' | 'pending' | 'paid' | 'failed' | 'cancelled';
