export type OrderStatus = 'new' | 'confirmed';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'cancelled';
export type PaymentMethod = 'cod' | 'vnpay';
export type ShippingStatus = 'pending';
export type ShippingMethod = 'manual';

export interface CustomerOrderListItem {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingStatus: ShippingStatus;
  itemCount: number;
  total: string;
  currency: 'VND';
  createdAt: string;
}

export interface CustomerOrderDetail {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingStatus: ShippingStatus;
  shippingMethod: ShippingMethod;
  items: Array<{
    productId: string | null;
    productName: string;
    sku: string | null;
    unitPrice: string;
    quantity: number;
    lineTotal: string;
  }>;
  subtotal: string;
  shippingFee: string;
  total: string;
  currency: 'VND';
  shippingAddress: {
    recipientName: string;
    phone: string;
    countryCode: string | null;
    provinceCity: string | null;
    district: string | null;
    ward: string | null;
    addressLine: string | null;
    note: string | null;
  };
  payment: {
    paymentId: string;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: string;
    currency: 'VND';
    providerReference: string | null;
    paidAt: string | null;
    updatedAt: string;
  };
  shipping: {
    method: ShippingMethod;
    status: ShippingStatus;
    fee: string;
    trackingReference: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
  };
  createdAt: string;
  placedAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CustomerOrderListParams {
  page?: number;
  pageSize?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  dateFrom?: string;
  dateTo?: string;
}
