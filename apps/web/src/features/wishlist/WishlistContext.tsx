import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '../auth/AuthContext';
import { wishlistApi } from './wishlistApi';
import type { ServerWishlist, ServerWishlistItem } from './wishlist.types';

interface WishlistContextValue {
  items: ServerWishlistItem[];
  productIds: string[];
  loading: boolean;
  error: string | null;
  has(productId: string): boolean;
  isPending(productId: string): boolean;
  reload(): Promise<void>;
  toggle(productId: string): Promise<void>;
  remove(productId: string): Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const actorId =
    auth.status === 'authenticated' && auth.hasRole('CUSTOMER') ? (auth.actor?.id ?? null) : null;
  return (
    <WishlistStateProvider key={actorId ?? 'guest'} enabled={Boolean(actorId)}>
      {children}
    </WishlistStateProvider>
  );
}

function WishlistStateProvider({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const [wishlist, setWishlist] = useState<ServerWishlist | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [pendingProductIds, setPendingProductIds] = useState<string[]>([]);
  const pendingRef = useRef(new Set<string>());

  const reload = useCallback(async () => {
    if (!enabled) {
      setWishlist(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setWishlist(await wishlistApi.get());
    } catch {
      setError('Không thể tải Wishlist từ máy chủ.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const mutate = useCallback(async (productId: string, operation: () => Promise<unknown>) => {
    if (pendingRef.current.has(productId)) return;
    pendingRef.current.add(productId);
    setPendingProductIds(Array.from(pendingRef.current));
    setError(null);
    try {
      await operation();
      setWishlist(await wishlistApi.get());
    } catch (mutationError) {
      setError('Không thể cập nhật Wishlist. Vui lòng thử lại.');
      throw mutationError;
    } finally {
      pendingRef.current.delete(productId);
      setPendingProductIds(Array.from(pendingRef.current));
    }
  }, []);

  const items = useMemo(() => wishlist?.items ?? [], [wishlist]);
  const productIds = useMemo(() => items.map((item) => item.product.productId), [items]);
  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      productIds,
      loading,
      error,
      has: (productId) => productIds.includes(productId),
      isPending: (productId) => pendingProductIds.includes(productId),
      reload,
      toggle: (productId) =>
        mutate(productId, () =>
          productIds.includes(productId)
            ? wishlistApi.remove(productId)
            : wishlistApi.add(productId),
        ),
      remove: (productId) => mutate(productId, () => wishlistApi.remove(productId)),
    }),
    [error, items, loading, mutate, pendingProductIds, productIds, reload],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist phải được dùng bên trong WishlistProvider.');
  return context;
}
