import type { Badge } from '../../components';
import type { OrderStatus, PaymentMethod, PaymentStatus, ShippingStatus } from './order.types';

type BadgeTone = Parameters<typeof Badge>[0]['tone'];

export function orderStatusLabel(status: OrderStatus | string): string {
  if (status === 'new') return 'Đơn mới';
  if (status === 'confirmed') return 'Đã xác nhận';
  if (status === 'completed') return 'Đã hoàn tất';
  if (status === 'cancelled') return 'Đã hủy';
  if (status === 'returned') return 'Đã trả hàng';
  return 'Chưa xác định';
}

export function orderStatusTone(status: OrderStatus | string): BadgeTone {
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'error';
  if (status === 'returned') return 'warning';
  if (status === 'confirmed') return 'info';
  if (status === 'new') return 'info';
  return 'neutral';
}

export function paymentStatusLabel(status: PaymentStatus | string): string {
  if (status === 'unpaid') return 'Chưa thanh toán';
  if (status === 'pending') return 'Đang chờ thanh toán';
  if (status === 'paid') return 'Đã thanh toán';
  if (status === 'failed') return 'Thanh toán thất bại';
  if (status === 'cancelled') return 'Thanh toán đã hủy';
  return 'Chưa xác định';
}

export function paymentStatusTone(status: PaymentStatus | string): BadgeTone {
  if (status === 'paid') return 'success';
  if (status === 'failed') return 'error';
  if (status === 'cancelled') return 'warning';
  if (status === 'pending' || status === 'unpaid') return 'info';
  return 'neutral';
}

export function paymentMethodLabel(method: PaymentMethod | string): string {
  if (method === 'cod') return 'Thanh toán khi nhận hàng (COD)';
  if (method === 'vnpay') return 'VNPAY';
  return 'Phương thức chưa xác định';
}

export function shippingStatusLabel(status: ShippingStatus | string): string {
  if (status === 'pending') return 'Đang chờ xử lý';
  if (status === 'shipped') return 'Đang giao hàng';
  if (status === 'delivered') return 'Đã giao hàng';
  if (status === 'cancelled') return 'Đã hủy giao';
  if (status === 'returned') return 'Đã trả hàng';
  return 'Chưa xác định';
}
