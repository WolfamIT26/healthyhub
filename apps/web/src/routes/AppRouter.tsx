import { Navigate, Route, Routes } from 'react-router-dom';

import { AdminLayout } from '../shared/layouts/AdminLayout';
import { CustomerLayout } from '../shared/layouts/CustomerLayout';
import { PublicLayout } from '../shared/layouts/PublicLayout';
import { AdminHomePage } from '../pages/AdminHomePage';
import { CustomerHomePage } from '../pages/CustomerHomePage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RouteGuard } from './RouteGuard';

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
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
