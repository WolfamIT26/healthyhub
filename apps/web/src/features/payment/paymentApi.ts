import type { ApiSuccessEnvelope } from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';
import type { CreatePaymentIntentInput, PaymentSummary } from './payment.types';

/** Typed future boundary only. No caller enables online payment until a provider is approved. */
export const paymentApi = {
  createIntent: (input: CreatePaymentIntentInput, idempotencyKey: string) =>
    httpClient
      .post<ApiSuccessEnvelope<PaymentSummary>>('/payments/intents', input, {
        headers: { 'X-Idempotency-Key': idempotencyKey },
      })
      .then((response) => response.data.data),
  getStatus: (paymentId: string) =>
    httpClient
      .get<ApiSuccessEnvelope<PaymentSummary>>(`/payments/${paymentId}`)
      .then((response) => response.data.data),
};
