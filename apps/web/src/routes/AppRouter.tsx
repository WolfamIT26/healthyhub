import { Navigate, Route, Routes } from 'react-router-dom';

import { AdminLayout } from '../shared/layouts/AdminLayout';
import { CustomerLayout } from '../shared/layouts/CustomerLayout';
import { PublicLayout } from '../shared/layouts/PublicLayout';
import { AdminHomePage } from '../pages/AdminHomePage';
import { CustomerHomePage } from '../pages/CustomerHomePage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RouteGuard } from './RouteGuard';
import { GuestOnlyRoute } from './RouteGuard';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { ForbiddenPage } from '../pages/ForbiddenPage';
import { ComingSoonPage } from '../pages/ComingSoonPage';
import { ProductCatalogPage } from '../pages/ProductCatalogPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { WishlistPage } from '../pages/WishlistPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentReturnPage } from '../pages/PaymentReturnPage';
import { PaymentResultPage } from '../pages/PaymentResultPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          index
          element={
            <RouteGuard area="public">
              <HomePage />
            </RouteGuard>
          }
        />
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnlyRoute>
              <RegisterPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestOnlyRoute>
              <ForgotPasswordPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestOnlyRoute>
              <ResetPasswordPage />
            </GuestOnlyRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/products" element={<ProductCatalogPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route
          path="/wishlist"
          element={
            <RouteGuard area="customer">
              <WishlistPage />
            </RouteGuard>
          }
        />
        <Route
          path="/cart"
          element={
            <RouteGuard area="customer">
              <CartPage />
            </RouteGuard>
          }
        />
        <Route
          path="/checkout"
          element={
            <RouteGuard area="customer">
              <CheckoutPage />
            </RouteGuard>
          }
        />
        <Route
          path="/payment/vnpay/return"
          element={
            <RouteGuard area="customer">
              <PaymentReturnPage />
            </RouteGuard>
          }
        />
        <Route
          path="/payment/vnpay/result"
          element={
            <RouteGuard area="customer">
              <PaymentResultPage />
            </RouteGuard>
          }
        />
        <Route path="/promotions" element={<ComingSoonPage title="Khuyến mãi" />} />
        <Route path="/blog/*" element={<ComingSoonPage title="Blog HealthyHub" />} />
        <Route path="/ai" element={<ComingSoonPage title="Trợ lý AI" />} />
      </Route>
      <Route element={<CustomerLayout />}>
        <Route
          path="/customer"
          element={
            <RouteGuard area="customer">
              <CustomerHomePage />
            </RouteGuard>
          }
        />
      </Route>
      <Route element={<AdminLayout />}>
        <Route
          path="/admin"
          element={
            <RouteGuard area="admin">
              <AdminHomePage />
            </RouteGuard>
          }
        />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
