import type { ApiSuccessEnvelope } from './index';

export const ADMIN_ORDER_STATUSES = [
  'new',
  'confirmed',
  'completed',
  'cancelled',
  'returned',
] as const;
export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export const ADMIN_REVIEW_STATUSES = ['published', 'hidden', 'rejected'] as const;
export type AdminReviewStatus = (typeof ADMIN_REVIEW_STATUSES)[number];

export interface AdminProductMetrics {
  total: number;
  activePublic: number;
  unavailable: number;
}

export interface AdminOrderMetrics {
  total: number;
  byStatus: Record<AdminOrderStatus, number>;
}

export interface AdminReviewMetrics {
  total: number;
  byStatus: Record<AdminReviewStatus, number>;
}

export interface AdminDashboardMetrics {
  products: AdminProductMetrics;
  orders: AdminOrderMetrics;
  reviews: AdminReviewMetrics;
}

export interface AdminDashboardResult extends AdminDashboardMetrics {
  generatedAt: string;
}

export type AdminDashboardResponse = ApiSuccessEnvelope<AdminDashboardResult>;
