import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '../auth/AuthContext';
import { cartApi } from './cartApi';
import type { ServerCart, ServerCartItem } from './cart.types';

interface CartContextValue {
  cart: ServerCart | null;
  items: ServerCartItem[];
  itemCount: number;
  loading: boolean;
  error: string | null;
  pendingItemId: string | null;
  reload(): Promise<void>;
  add(productId: string, quantity: number): Promise<void>;
  update(cartItemId: string, quantity: number): Promise<void>;
  remove(cartItemId: string): Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const actorId =
    auth.status === 'authenticated' && auth.hasRole('CUSTOMER') ? (auth.actor?.id ?? null) : null;
  return (
    <CartStateProvider key={actorId ?? 'guest'} enabled={Boolean(actorId)}>
      {children}
    </CartStateProvider>
  );
}

function CartStateProvider({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const [cart, setCart] = useState<ServerCart | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) {
      setCart(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setCart(await cartApi.get());
    } catch {
      setError('Không thể tải giỏ hàng từ máy chủ.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const mutate = useCallback(async (key: string, operation: () => Promise<ServerCart>) => {
    setPendingItemId(key);
    setError(null);
    try {
      setCart(await operation());
    } catch (mutationError) {
      setError('Không thể cập nhật giỏ hàng. Vui lòng thử lại.');
      throw mutationError;
    } finally {
      setPendingItemId(null);
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items: cart?.items ?? [],
      itemCount: cart?.itemCount ?? 0,
      loading,
      error,
      pendingItemId,
      reload,
      add: (productId, quantity) =>
        mutate(`product:${productId}`, () => cartApi.add(productId, quantity)),
      update: (cartItemId, quantity) =>
        mutate(cartItemId, () => cartApi.update(cartItemId, quantity)),
      remove: (cartItemId) => mutate(cartItemId, () => cartApi.remove(cartItemId)),
    }),
    [cart, error, loading, mutate, pendingItemId, reload],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart phải được dùng bên trong CartProvider.');
  return context;
}
