import type { ApiSuccessEnvelope } from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';
import type { CreatePaymentIntentInput, PaymentMethodReadModel, PaymentSummary } from './payment.types';

export const paymentApi = {
  listMethods: () =>
    httpClient
      .get<ApiSuccessEnvelope<readonly PaymentMethodReadModel[]>>('/payments/methods')
      .then((response) => response.data.data),
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
  processVnpayReturn: (search: string) =>
    httpClient
      .get<ApiSuccessEnvelope<PaymentSummary>>(
        `/payments/vnpay/return${search.startsWith('?') ? search : search ? `?${search}` : ''}`,
      )
      .then((response) => response.data.data),
};
