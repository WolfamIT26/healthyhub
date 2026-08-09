import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Alert, Breadcrumb, buttonClassName, Button, Card, EmptyState, ErrorState, IconButton, Modal, Skeleton } from '../components';
import { CartSummary } from '../features/cart/CartSummary';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/AuthContext';
import { authApi } from '../features/auth/authApi';

const moneyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

export function CartPage() {
  const auth = useAuth();
  const cart = useCart();
  const [quantityErrors, setQuantityErrors] = useState<Record<string, string>>({});
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [resendState, setResendState] = useState<'idle' | 'pending' | 'accepted' | 'error'>('idle');
  const items = cart.items;
  const hasUnavailableItem = !cart.cart?.isValid;

  function updateQuantity(cartItemId: string, rawQuantity: number) {
    if (!Number.isInteger(rawQuantity) || rawQuantity < 1 || rawQuantity > 9999) {
      setQuantityErrors((current) => ({ ...current, [cartItemId]: 'Số lượng phải là số nguyên từ 1 đến 9999.' }));
      return;
    }
    setQuantityErrors((current) => ({ ...current, [cartItemId]: '' }));
    void cart.update(cartItemId, rawQuantity).catch(() => undefined);
  }

  async function resendVerification() {
    if (!auth.actor || resendState === 'pending') return;
    setResendState('pending');
    try {
      await authApi.resendVerification({ email: auth.actor.email });
      setResendState('accepted');
    } catch {
      setResendState('error');
    }
  }

  return <main className="flex-1 bg-neutral-50">
    <div className="container py-8 sm:py-10">
      <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng' }]} />
      <div className="mt-5"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">Customer Cart</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">Giỏ hàng của bạn</h1><p className="mt-3 text-neutral-600" aria-live="polite">{cart.itemCount} sản phẩm</p></div>
      {cart.error ? <Alert tone="error" className="mt-5">{cart.error}</Alert> : null}
      {cart.loading ? <div className="mt-8 grid gap-4" aria-label="Đang tải giỏ hàng"><Skeleton className="h-44" /><Skeleton className="h-44" /></div> : cart.error && !cart.cart ? <div className="mt-8"><ErrorState title="Không thể tải giỏ hàng" description="Kết nối tới Cart server không thành công." action={<Button type="button" onClick={() => { void cart.reload(); }}>Thử lại</Button>} /></div> : items.length === 0 ? <div className="mt-8"><EmptyState title="Giỏ hàng của bạn đang trống." description="Khám phá catalog để tìm sản phẩm phù hợp." action={<Link to="/products" className={buttonClassName()}>Khám phá sản phẩm</Link>} /></div> : <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-4" aria-label="Sản phẩm trong giỏ hàng">{items.map((item) => {
          const unavailable = !['AVAILABLE', 'LOW_STOCK'].includes(item.availability);
          const pending = cart.pendingItemId === item.id;
          return <Card key={item.id} className="grid gap-4 sm:grid-cols-[112px_minmax(0,1fr)]">
            <div className="flex aspect-square items-center justify-center rounded-card bg-primary-50 text-5xl" role="img" aria-label={`Minh họa ${item.name}`}>🛒</div>
            <div className="min-w-0"><div className="flex items-start justify-between gap-3"><div><Link to={`/products/${item.slug}`} className="font-bold text-neutral-950 hover:text-primary-700">{item.name}</Link><p className="mt-1 text-sm text-neutral-500">Mã sản phẩm {item.productId}</p></div><IconButton label={`Xóa ${item.name} khỏi giỏ hàng`} disabled={pending} onClick={() => { void cart.remove(item.id).catch(() => undefined); }}>×</IconButton></div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold text-primary-700">{moneyFormatter.format(Number(item.unitPrice))}</p><p className="text-xs text-neutral-500">Đơn giá từ máy chủ</p></div><p className={`text-sm font-semibold ${unavailable ? 'text-error-dark' : item.availability === 'LOW_STOCK' ? 'text-warning-dark' : 'text-success-dark'}`}>{availabilityLabel(item.availability)}</p></div>
              <div className="mt-4 flex flex-wrap items-center gap-2"><IconButton label={`Giảm số lượng ${item.name}`} disabled={pending || unavailable || item.quantity <= 1} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</IconButton><label className="sr-only" htmlFor={`quantity-${item.id}`}>Số lượng {item.name}</label><input id={`quantity-${item.id}`} aria-label={`Số lượng ${item.name}`} aria-invalid={Boolean(quantityErrors[item.id])} className="h-11 w-20 rounded-control border border-neutral-300 text-center" type="number" min="1" max="9999" step="1" value={item.quantity} disabled={pending || unavailable} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} /><IconButton label={`Tăng số lượng ${item.name}`} disabled={pending || unavailable} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</IconButton><span className="ml-auto font-bold">{moneyFormatter.format(Number(item.lineTotal))}</span></div>
              {quantityErrors[item.id] ? <p className="mt-2 text-sm text-error-dark" role="alert">{quantityErrors[item.id]}</p> : null}{unavailable ? <Alert tone="error" className="mt-3">Sản phẩm hiện không đủ điều kiện Checkout. Item không tự bị xóa.</Alert> : null}
            </div>
          </Card>;
        })}<Link to="/products" className={buttonClassName({ variant: 'ghost' })}>← Tiếp tục mua sắm</Link></section>
        <aside><CartSummary itemCount={cart.itemCount} subtotal={cart.cart?.subtotal ?? '0.00'} action={hasUnavailableItem ? <Button type="button" className="w-full" disabled>Checkout chưa khả dụng</Button> : auth.actor?.isEmailVerified === false ? <Button type="button" className="w-full" onClick={() => setVerificationOpen(true)}>Tiến hành Checkout</Button> : <Link to="/checkout" className={buttonClassName({ className: 'w-full' })}>Tiến hành Checkout</Link>} /></aside>
      </div>}
    </div>
    <Modal open={verificationOpen} onClose={() => setVerificationOpen(false)} title="Bạn cần xác minh email trước khi thanh toán." footer={<><Button type="button" variant="ghost" disabled={resendState === 'pending'} onClick={() => { void resendVerification(); }}>{resendState === 'pending' ? 'Đang gửi…' : 'Gửi lại email'}</Button><Link to="/verify-email" className={buttonClassName()}>Xác minh ngay</Link></>}><p>Cart vẫn sử dụng được; chỉ bước Checkout yêu cầu email đã xác minh.</p>{resendState === 'accepted' ? <p className="mt-2 text-success-dark" role="status">Email xác minh đã được gửi lại.</p> : null}{resendState === 'error' ? <p className="mt-2 text-error-dark" role="alert">Không thể gửi lại email lúc này.</p> : null}</Modal>
  </main>;
}

function availabilityLabel(status: string): string {
  const labels: Record<string, string> = {
    AVAILABLE: 'Còn hàng', LOW_STOCK: 'Sắp hết hàng', INSUFFICIENT_STOCK: 'Không đủ tồn kho',
    OUT_OF_STOCK: 'Hết hàng', UNAVAILABLE: 'Không khả dụng', INVALID_QUANTITY: 'Số lượng không hợp lệ',
  };
  return labels[status] ?? 'Không khả dụng';
}
