import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '../auth/AuthContext';
import { ProductReviewsSection } from './ProductReviewsSection';
import { reviewApi } from './reviewApi';

vi.mock('../auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('./reviewApi', () => ({
  reviewApi: {
    listPublic: vi.fn(),
    summary: vi.fn(),
    mine: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const emptyPage = { items: [], page: 1, pageSize: 5, totalItems: 0, totalPages: 0 };
const summary = {
  productId: '4',
  averageRating: 4.5,
  totalReviews: 2,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 },
};
const guestAuth = {
  status: 'guest' as const,
  actor: null,
  current: null,
  login: vi.fn(),
  logout: vi.fn(),
  hasRole: vi.fn().mockReturnValue(false),
  hasPermission: vi.fn(),
};
const customerAuth = {
  ...guestAuth,
  status: 'authenticated' as const,
  actor: {
    id: '7',
    email: 'customer@example.test',
    fullName: 'Customer',
    roles: ['CUSTOMER'] as Array<'CUSTOMER'>,
    isEmailVerified: true,
  },
  hasRole: vi.fn().mockReturnValue(true),
};

function renderSection() {
  return render(
    <MemoryRouter>
      <ProductReviewsSection productId="4" productSlug="healthy-product" />
    </MemoryRouter>,
  );
}

describe('ProductReviewsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue(guestAuth);
    vi.mocked(reviewApi.listPublic).mockResolvedValue(emptyPage);
    vi.mocked(reviewApi.summary).mockResolvedValue(summary);
    vi.mocked(reviewApi.mine).mockResolvedValue({
      ...emptyPage,
      eligibility: {
        eligible: false,
        reason: 'NO_FULFILLED_PURCHASE',
        orderId: null,
        completedAt: null,
      },
    });
  });

  it('renders persisted average, distribution, public content and verified badge', async () => {
    vi.mocked(reviewApi.listPublic).mockResolvedValue({
      items: [
        {
          reviewId: '11',
          rating: 5,
          content: '<script>không chạy</script> Rất tốt',
          authorDisplayName: 'Khách hàng HealthyHub',
          verifiedPurchase: true,
          createdAt: '2026-08-21T01:00:00.000Z',
          updatedAt: '2026-08-21T01:00:00.000Z',
        },
      ],
      page: 1,
      pageSize: 5,
      totalItems: 1,
      totalPages: 1,
    });
    renderSection();

    expect(await screen.findByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('2 đánh giá đã đăng')).toBeInTheDocument();
    expect(screen.getByText('Đã mua và nhận hàng')).toBeInTheDocument();
    expect(screen.getByText('<script>không chạy</script> Rất tốt')).toBeInTheDocument();
    expect(document.querySelector('script')).toBeNull();
  });

  it('shows a login CTA to guests', async () => {
    renderSection();
    expect(await screen.findByText('Chưa có đánh giá')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Đăng nhập để đánh giá' })).toHaveAttribute(
      'href',
      '/login?redirect=%2Fproducts%2Fhealthy-product',
    );
  });

  it('renders a Review error state and retries without affecting Product authority', async () => {
    vi.mocked(reviewApi.listPublic).mockRejectedValue(new Error('offline'));
    renderSection();
    expect(await screen.findByText('Không thể tải đánh giá')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
    await waitFor(() => expect(reviewApi.listPublic).toHaveBeenCalledTimes(2));
  });

  it('allows an eligible Customer to submit with the authoritative Order identity', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    vi.mocked(reviewApi.mine).mockResolvedValue({
      ...emptyPage,
      eligibility: {
        eligible: true,
        reason: 'ELIGIBLE',
        orderId: '81',
        completedAt: '2026-08-20T01:00:00.000Z',
      },
    });
    vi.mocked(reviewApi.create).mockResolvedValue({} as never);
    renderSection();

    const input = await screen.findByLabelText(/Nội dung đánh giá/);
    await userEvent.type(input, 'Sản phẩm rất tốt');
    await userEvent.click(screen.getByRole('radio', { name: '4★' }));
    await userEvent.click(screen.getByRole('button', { name: 'Đăng đánh giá' }));

    await waitFor(() =>
      expect(reviewApi.create).toHaveBeenCalledWith({
        orderId: '81',
        productId: '4',
        rating: 4,
        content: 'Sản phẩm rất tốt',
      }),
    );
  });

  it('shows a safe reason without a fake submit for an ineligible Customer', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    renderSection();
    expect(
      await screen.findByText(
        'Bạn có thể đánh giá sau khi đơn hàng chứa sản phẩm này được giao hoàn tất.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Đăng đánh giá' })).not.toBeInTheDocument();
  });

  it('supports owner edit and delete while explaining a revoked verified badge', async () => {
    vi.mocked(useAuth).mockReturnValue(customerAuth);
    vi.mocked(reviewApi.mine).mockResolvedValue({
      items: [
        {
          reviewId: '11',
          product: { productId: '4', name: 'Healthy Product', slug: 'healthy-product' },
          rating: 4,
          content: 'Nội dung cũ',
          status: 'published',
          verifiedPurchase: false,
          createdAt: '2026-08-21T01:00:00.000Z',
          updatedAt: '2026-08-21T01:00:00.000Z',
        },
      ],
      page: 1,
      pageSize: 5,
      totalItems: 1,
      totalPages: 1,
      eligibility: {
        eligible: false,
        reason: 'ALREADY_REVIEWED',
        orderId: null,
        completedAt: null,
      },
    });
    vi.mocked(reviewApi.update).mockResolvedValue({} as never);
    vi.mocked(reviewApi.delete).mockResolvedValue({ reviewId: '11', deleted: true });
    renderSection();

    expect(await screen.findByText(/huy hiệu mua hàng đã được thu hồi/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Chỉnh sửa' }));
    const textarea = screen.getByLabelText(/Nội dung đánh giá/);
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'Nội dung mới');
    await userEvent.click(screen.getByRole('button', { name: 'Lưu chỉnh sửa' }));
    await waitFor(() =>
      expect(reviewApi.update).toHaveBeenCalledWith('11', {
        rating: 4,
        content: 'Nội dung mới',
      }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Xóa' }));
    await userEvent.click(screen.getByRole('button', { name: 'Xác nhận xóa' }));
    await waitFor(() => expect(reviewApi.delete).toHaveBeenCalledWith('11'));
  });

  it('supports public pagination', async () => {
    vi.mocked(reviewApi.listPublic).mockResolvedValue({
      ...emptyPage,
      items: [
        {
          reviewId: '11',
          rating: 5,
          content: 'Rất tốt',
          authorDisplayName: 'Khách hàng HealthyHub',
          verifiedPurchase: true,
          createdAt: '2026-08-21T01:00:00.000Z',
          updatedAt: '2026-08-21T01:00:00.000Z',
        },
      ],
      totalItems: 6,
      totalPages: 2,
    });
    renderSection();
    await userEvent.click(await screen.findByRole('button', { name: 'Trang 2' }));
    await waitFor(() =>
      expect(reviewApi.listPublic).toHaveBeenCalledWith('4', 2, 5, expect.any(AbortSignal)),
    );
  });
});
