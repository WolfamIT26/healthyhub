import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, ConfirmDialog, IconButton } from '../../components';
import { useAuth } from '../auth/AuthContext';
import { useCart } from './CartContext';

export function AddToCartButton({ productId, productName, quantity = 1, disabled = false, compact = false, className }: { productId: string; productName: string; quantity?: number; disabled?: boolean; compact?: boolean; className?: string }) {
  const auth = useAuth();
  const cart = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<'login' | 'customer-only' | null>(null);
  const [error, setError] = useState(false);
  const label = `Thêm ${productName} vào giỏ hàng`;

  async function add() {
    if (auth.status !== 'authenticated') { setPrompt('login'); return; }
    if (!auth.hasRole('CUSTOMER')) { setPrompt('customer-only'); return; }
    setError(false);
    try { await cart.add(productId, quantity); }
    catch { setError(true); }
  }

  return <>
    {compact
      ? <IconButton label={label} disabled={disabled} className={className} onClick={() => { void add(); }}><span aria-hidden="true">＋</span></IconButton>
      : <Button type="button" disabled={disabled} className={className} onClick={() => { void add(); }} aria-label={label}>{disabled ? 'Hết hàng' : 'Thêm vào giỏ'}</Button>}
    {error ? <span className="sr-only" role="alert">Không thể thêm sản phẩm vào giỏ hàng.</span> : null}
    <ConfirmDialog open={prompt !== null} onClose={() => setPrompt(null)} onConfirm={() => {
      if (prompt === 'login') navigate('/login', { state: { from: `${location.pathname}${location.search}` } });
      else setPrompt(null);
    }} title={prompt === 'customer-only' ? 'Giỏ hàng chỉ dành cho tài khoản Customer.' : 'Đăng nhập để thêm sản phẩm vào giỏ hàng.'} description={prompt === 'customer-only' ? 'Tài khoản nội bộ không sử dụng Customer Cart flow.' : 'Cart được gắn với tài khoản Customer và không được lưu giả trên trình duyệt.'} confirmLabel={prompt === 'customer-only' ? 'Đóng' : 'Đăng nhập'} />
  </>;
}
