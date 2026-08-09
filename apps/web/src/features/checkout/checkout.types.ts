export interface CheckoutAddress {
  recipientName: string;
  phone: string;
  countryCode: 'VN';
  provinceCity: string;
  district: string;
  ward?: string;
  addressLine: string;
  note?: string;
}

export interface ShippingQuote {
  quoteReference: string;
  methodCode: 'manual';
  methodName: string;
  shippingFee: string;
  currency: 'VND';
  available: true;
  estimatedDelivery: null;
}

export interface PaymentMethod {
  code: 'cod';
  name: string;
  enabled: true;
  captureRequired: false;
  initialPaymentStatus: 'pending';
}

export interface CreatedOrder {
  orderId: string;
  orderNumber: string;
  status: 'new';
  paymentStatus: 'pending';
  paymentMethod: 'cod';
  shippingStatus: 'pending';
  shippingMethod: 'manual';
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
  shippingAddress: Record<string, string | null>;
  createdAt: string;
}
