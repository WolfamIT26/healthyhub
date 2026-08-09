import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app/App';
import { ErrorBoundary } from './components/foundation/ErrorBoundary';
import { ToastProvider } from './components/foundation/ToastProvider';
import { AuthProvider } from './features/auth/AuthContext';
import { WishlistProvider } from './features/wishlist/WishlistContext';
import { CartProvider } from './features/cart/CartContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <WishlistProvider><CartProvider><App /></CartProvider></WishlistProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
