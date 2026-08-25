import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  FormField,
  LoadingState,
  Pagination,
  Textarea,
  buttonClassName,
} from '../../components';
import { useAuth } from '../auth/AuthContext';
import { reviewApi } from './reviewApi';
import type { MyReviewsResult, PublicReview, ReviewPage, ReviewSummary } from './review.types';

const EMPTY_SUMMARY: ReviewSummary = {
  productId: '',
  averageRating: null,
  totalReviews: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export function ProductReviewsSection({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const auth = useAuth();
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [publicState, setPublicState] = useState<
    | { status: 'loading' }
    | { status: 'error' }
    | { status: 'success'; page: ReviewPage<PublicReview>; summary: ReviewSummary }
  >({ status: 'loading' });
  const [mine, setMine] = useState<MyReviewsResult | null>(null);
  const [mineLoading, setMineLoading] = useState(false);
  const [mineError, setMineError] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mutationMessage, setMutationMessage] = useState<
    { tone: 'success' | 'error'; text: string } | undefined
  >();
  const customerAuthenticated = auth.status === 'authenticated' && auth.hasRole('CUSTOMER');

  useEffect(() => {
    const controller = new AbortController();
    setPublicState({ status: 'loading' });
    void Promise.all([
      reviewApi.listPublic(productId, page, 5, controller.signal),
      reviewApi.summary(productId, controller.signal),
    ])
      .then(([nextPage, summary]) => setPublicState({ status: 'success', page: nextPage, summary }))
      .catch(() => {
        if (!controller.signal.aborted) setPublicState({ status: 'error' });
      });
    return () => controller.abort();
  }, [page, productId, version]);

  useEffect(() => {
    if (!customerAuthenticated) {
      setMine(null);
      setMineLoading(false);
      setMineError(false);
      return;
    }
    const controller = new AbortController();
    setMineLoading(true);
    setMineError(false);
    void reviewApi
      .mine(productId, controller.signal)
      .then(setMine)
      .catch(() => {
        if (!controller.signal.aborted) setMineError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setMineLoading(false);
      });
    return () => controller.abort();
  }, [customerAuthenticated, productId, version]);

  const summary = publicState.status === 'success' ? publicState.summary : EMPTY_SUMMARY;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = content.trim();
    if (trimmed.length < 3 || trimmed.length > 2000) {
      setMutationMessage({
        tone: 'error',
        text: 'Nội dung đánh giá cần từ 3 đến 2000 ký tự.',
      });
      return;
    }
    setSubmitting(true);
    setMutationMessage(undefined);
    try {
      if (editingId) {
        await reviewApi.update(editingId, { rating, content: trimmed });
        setMutationMessage({ tone: 'success', text: 'Đã cập nhật đánh giá.' });
      } else if (mine?.eligibility?.eligible && mine.eligibility.orderId) {
        await reviewApi.create({
          orderId: mine.eligibility.orderId,
          productId,
          rating,
          content: trimmed,
        });
        setMutationMessage({ tone: 'success', text: 'Đã đăng đánh giá.' });
      }
      setContent('');
      setRating(5);
      setEditingId(null);
      setPage(1);
      setVersion((value) => value + 1);
    } catch (error) {
      setMutationMessage({ tone: 'error', text: errorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteReview(reviewId: string) {
    setSubmitting(true);
    setMutationMessage(undefined);
    try {
      await reviewApi.delete(reviewId);
      setDeletingId(null);
      setMutationMessage({ tone: 'success', text: 'Đã xóa đánh giá.' });
      setPage(1);
      setVersion((value) => value + 1);
    } catch (error) {
      setMutationMessage({ tone: 'error', text: errorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card aria-labelledby="product-reviews-title">
      <h2 id="product-reviews-title" className="text-2xl font-bold text-neutral-950">
        Đánh giá sản phẩm
      </h2>
      {publicState.status === 'loading' ? (
        <LoadingState label="Đang tải đánh giá…" />
      ) : publicState.status === 'error' ? (
        <ErrorState
          title="Không thể tải đánh giá"
          description="Nguồn Review tạm thời chưa sẵn sàng."
          action={<Button onClick={() => setVersion((value) => value + 1)}>Thử lại</Button>}
        />
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div>
              <p className="text-4xl font-bold text-primary-700">
                {summary.averageRating === null ? '—' : summary.averageRating.toFixed(1)}
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                {summary.totalReviews} đánh giá đã đăng
              </p>
            </div>
            <div className="space-y-1" aria-label="Phân bố điểm đánh giá">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.distribution[star as 1 | 2 | 3 | 4 | 5];
                const percent = summary.totalReviews ? (count / summary.totalReviews) * 100 : 0;
                return (
                  <div
                    key={star}
                    className="grid grid-cols-[3rem_1fr_2rem] items-center gap-2 text-xs"
                  >
                    <span>{star} ★</span>
                    <span className="h-2 overflow-hidden rounded-full bg-neutral-200">
                      <span
                        className="block h-full rounded-full bg-accent"
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                    <span className="text-right text-neutral-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {publicState.page.items.length ? (
            <div className="mt-6 space-y-4">
              {publicState.page.items.map((review) => (
                <article key={review.reviewId} className="border-t border-neutral-200 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-neutral-900">
                      {review.authorDisplayName}
                    </span>
                    {review.verifiedPurchase ? (
                      <Badge tone="success">Đã mua và nhận hàng</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-accent-dark" aria-label={`${review.rating} trên 5 sao`}>
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-700">
                    {review.content}
                  </p>
                  <time className="mt-2 block text-xs text-neutral-500" dateTime={review.createdAt}>
                    {new Intl.DateTimeFormat('vi-VN').format(new Date(review.createdAt))}
                  </time>
                </article>
              ))}
              {publicState.page.totalPages > 1 ? (
                <Pagination
                  page={publicState.page.page}
                  pageCount={publicState.page.totalPages}
                  onPageChange={setPage}
                  label="Phân trang đánh giá"
                />
              ) : null}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="Chưa có đánh giá"
                description="Hãy là khách hàng đầu tiên chia sẻ trải nghiệm sau khi đơn hàng được giao."
              />
            </div>
          )}
        </>
      )}

      <div className="mt-6 border-t border-neutral-200 pt-6">
        {auth.status === 'restoring' ? (
          <LoadingState label="Đang xác minh tài khoản…" />
        ) : !customerAuthenticated ? (
          <Alert tone="info" title="Bạn đã mua sản phẩm này?">
            <Link
              className={buttonClassName({ variant: 'outline', size: 'sm', className: 'mt-3' })}
              to={`/login?redirect=${encodeURIComponent(`/products/${productSlug}`)}`}
            >
              Đăng nhập để đánh giá
            </Link>
          </Alert>
        ) : mineLoading ? (
          <LoadingState label="Đang kiểm tra quyền đánh giá…" />
        ) : mineError ? (
          <Alert tone="error">Không thể xác minh đơn hàng đã giao. Vui lòng thử lại sau.</Alert>
        ) : (
          <>
            {mine?.items.map((review) => (
              <div key={review.reviewId} className="mb-4 rounded-card bg-neutral-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">Đánh giá của bạn · {review.rating}/5 sao</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(review.reviewId);
                        setRating(review.rating);
                        setContent(review.content);
                        setMutationMessage(undefined);
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeletingId(review.reviewId)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
                {!review.verifiedPurchase ? (
                  <p className="mt-2 text-xs text-neutral-600">
                    Đơn hàng đã hoàn trả nên huy hiệu mua hàng đã được thu hồi; nội dung vẫn được
                    giữ.
                  </p>
                ) : null}
                {deletingId === review.reviewId ? (
                  <Alert tone="warning" className="mt-3" title="Xóa đánh giá này?">
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="danger"
                        loading={submitting}
                        onClick={() => void deleteReview(review.reviewId)}
                      >
                        Xác nhận xóa
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeletingId(null)}>
                        Giữ lại
                      </Button>
                    </div>
                  </Alert>
                ) : null}
              </div>
            ))}

            {editingId || mine?.eligibility?.eligible ? (
              <form className="space-y-4" onSubmit={(event) => void submit(event)}>
                <fieldset>
                  <legend className="text-sm font-semibold text-neutral-800">Điểm đánh giá</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star} className="cursor-pointer">
                        <input
                          className="sr-only"
                          type="radio"
                          name="review-rating"
                          value={star}
                          checked={rating === star}
                          onChange={() => setRating(star)}
                        />
                        <span
                          className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border text-xl ${rating === star ? 'border-accent bg-accent-light text-accent-dark' : 'border-neutral-300 text-neutral-500'}`}
                        >
                          {star}★
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <FormField
                  id="review-content"
                  label="Nội dung đánh giá"
                  required
                  helperText={`${content.length}/2000 ký tự`}
                >
                  <Textarea
                    id="review-content"
                    minLength={3}
                    maxLength={2000}
                    required
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                  />
                </FormField>
                <div className="flex gap-2">
                  <Button type="submit" loading={submitting}>
                    {editingId ? 'Lưu chỉnh sửa' : 'Đăng đánh giá'}
                  </Button>
                  {editingId ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null);
                        setContent('');
                        setRating(5);
                      }}
                    >
                      Hủy
                    </Button>
                  ) : null}
                </div>
              </form>
            ) : (
              <Alert tone="info">
                {mine?.eligibility?.reason === 'ALREADY_REVIEWED'
                  ? 'Các lần mua đã giao của bạn cho sản phẩm này đều đã được đánh giá.'
                  : 'Bạn có thể đánh giá sau khi đơn hàng chứa sản phẩm này được giao hoàn tất.'}
              </Alert>
            )}
          </>
        )}
        {mutationMessage ? (
          <Alert tone={mutationMessage.tone} className="mt-4">
            {mutationMessage.text}
          </Alert>
        ) : null}
      </div>
    </Card>
  );
}

function errorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  return 'Không thể lưu đánh giá. Vui lòng thử lại.';
}
