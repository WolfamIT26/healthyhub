export type PaymentStatus =
  'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded' | 'cancelled';

export interface PaymentSummary {
  id: string;
  orderId: string;
  method: 'cod' | 'bank_transfer' | 'online';
  status: PaymentStatus;
  amount: string;
  currency: 'VND';
  providerReference: string | null;
  redirectUrl?: string | null;
  updatedAt: string;
}

export interface CreatePaymentIntentInput {
  orderId: string;
  paymentMethod: 'online';
}

export type PaymentUiState =
  'idle' | 'creating' | 'redirect_required' | 'pending' | 'paid' | 'failed' | 'cancelled';
