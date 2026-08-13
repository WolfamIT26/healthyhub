import type { ApiSuccessEnvelope } from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';
import type {
  CustomerAddress,
  CustomerAddressInput,
  CustomerProfile,
  CustomerProfileUpdate,
} from './customer.types';

export const customerApi = {
  getProfile: () =>
    httpClient
      .get<ApiSuccessEnvelope<CustomerProfile>>('/me/profile')
      .then((response) => response.data.data),
  updateProfile: (input: CustomerProfileUpdate) =>
    httpClient
      .patch<ApiSuccessEnvelope<CustomerProfile>>('/me/profile', input, {
        headers: { 'X-Idempotency-Key': mutationKey('profile') },
      })
      .then((response) => response.data.data),
  listAddresses: () =>
    httpClient
      .get<ApiSuccessEnvelope<CustomerAddress[]>>('/me/addresses')
      .then((response) => response.data.data),
  createAddress: (input: CustomerAddressInput, idempotencyKey: string) =>
    httpClient
      .post<ApiSuccessEnvelope<CustomerAddress>>('/me/addresses', input, {
        headers: { 'X-Idempotency-Key': idempotencyKey },
      })
      .then((response) => response.data.data),
  updateAddress: (addressId: string, input: Partial<CustomerAddressInput>) =>
    httpClient
      .patch<ApiSuccessEnvelope<CustomerAddress>>(`/me/addresses/${addressId}`, input, {
        headers: { 'X-Idempotency-Key': mutationKey(`address-${addressId}`) },
      })
      .then((response) => response.data.data),
  deleteAddress: (addressId: string) =>
    httpClient
      .delete<ApiSuccessEnvelope<{ addressId: string; deleted: true }>>(
        `/me/addresses/${addressId}`,
        { headers: { 'X-Idempotency-Key': mutationKey(`address-delete-${addressId}`) } },
      )
      .then((response) => response.data.data),
};

export function mutationKey(scope: string): string {
  const randomValue =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${scope}-${randomValue}`;
}
