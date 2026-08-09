import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '../auth/AuthContext';

interface WishlistContextValue {
  productIds: string[];
  has(productId: string): boolean;
  toggle(productId: string): void;
  remove(productId: string): void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const actorId = auth.status === 'authenticated' ? auth.actor?.id ?? null : null;
  return <WishlistStateProvider key={actorId ?? 'guest'}>{children}</WishlistStateProvider>;
}

function WishlistStateProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);

  const value = useMemo<WishlistContextValue>(() => ({
    productIds,
    has: (productId) => productIds.includes(productId),
    toggle: (productId) => setProductIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]),
    remove: (productId) => setProductIds((current) => current.filter((id) => id !== productId)),
  }), [productIds]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist phải được dùng bên trong WishlistProvider.');
  return context;
}
