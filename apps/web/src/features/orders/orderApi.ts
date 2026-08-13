import type { ApiSuccessEnvelope, PaginatedApiResponse } from '@healthyhub/shared-types';

import { httpClient } from '../../services/api/httpClient';
import type {
  CustomerOrderDetail,
  CustomerOrderListItem,
  CustomerOrderListParams,
} from './order.types';

export const orderApi = {
  list: (params: CustomerOrderListParams) =>
    httpClient
      .get<PaginatedApiResponse<CustomerOrderListItem>>('/me/orders', { params })
      .then((response) => ({
        items: response.data.data.items,
        pagination: response.data.metadata.pagination,
      })),
  detail: (orderId: string) =>
    httpClient
      .get<ApiSuccessEnvelope<CustomerOrderDetail>>(`/me/orders/${orderId}`)
      .then((response) => response.data.data),
};
