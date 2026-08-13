import type { OrderEntity, OrderItemEntity } from '../entities';
import type { PaymentEntity } from '../../payment/entities';
import type { ShipmentEntity, ShippingAddressEntity } from '../../shipping/entities';

export interface OrderSnapshotInput {
  customerProfileId: string;
  cartId: string;
  orderCode: string;
  orderTotal: string;
  idempotencyKeyHash: string;
  requestHash: string;
  actorUserAccountId: string;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    unitPrice: string;
    quantity: number;
    lineTotal: string;
  }>;
  payment: { method: 'cod' | 'vnpay'; amount: string; status: 'pending' };
  shipping: {
    method: 'manual';
    fee: '0.00';
    address: { recipientName: string; phone: string; addressText: string; note: string | null };
  };
}

export interface PersistedOrderAggregate {
  order: OrderEntity;
  items: OrderItemEntity[];
  payment: PaymentEntity;
  shipment: ShipmentEntity;
  shippingAddress: ShippingAddressEntity;
}

export interface CustomerOrderListQuery {
  page: number;
  pageSize: number;
  orderStatus?: OrderEntity['orderStatus'];
  paymentStatus?: PaymentEntity['paymentStatus'];
  shippingStatus?: ShipmentEntity['shippingStatus'];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PersistedCustomerOrderSummary {
  order: OrderEntity;
  payment: PaymentEntity;
  shipment: ShipmentEntity;
  itemCount: number;
}

export interface PersistedCustomerOrderPage {
  items: PersistedCustomerOrderSummary[];
  totalItems: number;
}

export interface OrderRepository {
  findByIdempotency(
    customerProfileId: string,
    idempotencyKeyHash: string,
  ): Promise<PersistedOrderAggregate | null>;
  findCustomerPage(
    customerProfileId: string,
    query: CustomerOrderListQuery,
  ): Promise<PersistedCustomerOrderPage>;
  findCustomerById(
    customerProfileId: string,
    orderId: string,
  ): Promise<PersistedOrderAggregate | null>;
  createSnapshot(input: OrderSnapshotInput): Promise<PersistedOrderAggregate>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
