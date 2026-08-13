import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, ConfirmDialog, IconButton } from '../../components';
import { useAuth } from '../auth/AuthContext';
import { useWishlist } from './WishlistContext';

export function WishlistButton({
  productId,
  productName,
  compact = false,
  className,
}: {
  productId: string;
  productName: string;
  compact?: boolean;
  className?: string;
}) {
  const auth = useAuth();
  const wishlist = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const saved = wishlist.has(productId);
  const label = saved ? `Xóa ${productName} khỏi yêu thích` : `Thêm ${productName} vào yêu thích`;

  function toggle() {
    if (auth.status !== 'authenticated' || !auth.hasRole('CUSTOMER')) {
      setLoginPromptOpen(true);
      return;
    }
    wishlist.toggle(productId);
  }

  return (
    <>
      {compact ? (
        <IconButton label={label} aria-pressed={saved} className={className} onClick={toggle}>
          <span aria-hidden="true">{saved ? '♥' : '♡'}</span>
        </IconButton>
      ) : (
        <Button
          type="button"
          variant="outline"
          aria-label={label}
          aria-pressed={saved}
          className={className}
          onClick={toggle}
        >
          <span aria-hidden="true">{saved ? '♥' : '♡'}</span>
          {saved ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
        </Button>
      )}
      <ConfirmDialog
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        onConfirm={() =>
          navigate('/login', { state: { from: `${location.pathname}${location.search}` } })
        }
        title="Đăng nhập để lưu sản phẩm yêu thích."
        description="Wishlist được gắn với tài khoản Customer và không được lưu giả trên trình duyệt."
        confirmLabel="Đăng nhập"
      />
    </>
  );
}
