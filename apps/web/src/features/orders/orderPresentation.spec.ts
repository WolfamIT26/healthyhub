import { describe, expect, it } from 'vitest';

import { orderStatusLabel, orderStatusTone, shippingStatusLabel } from './orderPresentation';

describe('Order fulfillment presentation', () => {
  it('renders every executable Order lifecycle state', () => {
    expect(orderStatusLabel('new')).toBe('Đơn mới');
    expect(orderStatusLabel('confirmed')).toBe('Đã xác nhận');
    expect(orderStatusLabel('completed')).toBe('Đã hoàn tất');
    expect(orderStatusLabel('cancelled')).toBe('Đã hủy');
    expect(orderStatusLabel('returned')).toBe('Đã trả hàng');
    expect(orderStatusTone('completed')).toBe('success');
    expect(orderStatusTone('cancelled')).toBe('error');
  });

  it('renders every executable Shipment lifecycle state', () => {
    expect(shippingStatusLabel('pending')).toBe('Đang chờ xử lý');
    expect(shippingStatusLabel('shipped')).toBe('Đang giao hàng');
    expect(shippingStatusLabel('delivered')).toBe('Đã giao hàng');
    expect(shippingStatusLabel('cancelled')).toBe('Đã hủy giao');
    expect(shippingStatusLabel('returned')).toBe('Đã trả hàng');
  });
});
