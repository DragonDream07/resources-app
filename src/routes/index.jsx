import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';

import App from '@/App';

// Lazy-loaded page components
import { lazy, Suspense } from 'react';

const lazyLoad = (importFn) => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Component />
    </Suspense>
  );
};

// Guest pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Public pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));

// Protected pages
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutReviewPage = lazy(() => import('@/pages/checkout/CheckoutReviewPage'));
const CheckoutAddressPage = lazy(() => import('@/pages/checkout/CheckoutAddressPage'));
const CheckoutPlaceOrderPage = lazy(() => import('@/pages/checkout/CheckoutPlaceOrderPage'));
const PaymentPage = lazy(() => import('@/pages/PaymentPage'));
const OrdersPage = lazy(() => import('@/pages/orders/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/orders/OrderDetailPage'));
const OrderTrackingPage = lazy(() => import('@/pages/orders/OrderTrackingPage'));
const ReturnRequestPage = lazy(() => import('@/pages/orders/ReturnRequestPage'));
const ProfilePage = lazy(() => import('@/pages/account/ProfilePage'));
const AddressesPage = lazy(() => import('@/pages/account/AddressesPage'));
const ChangePasswordPage = lazy(() => import('@/pages/account/ChangePasswordPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));
const AdminBrandsPage = lazy(() => import('@/pages/admin/AdminBrandsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminReturnsPage = lazy(() => import('@/pages/admin/AdminReturnsPage'));
const AdminPromoCodesPage = lazy(() => import('@/pages/admin/AdminPromoCodesPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));

const wrap = (Component) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      {
        index: true,
        element: wrap(HomePage),
      },
      {
        path: 'search',
        element: wrap(SearchPage),
      },
      {
        path: 'products/:productId',
        element: wrap(ProductDetailPage),
      },
      {
        path: 'categories/:categoryId',
        element: wrap(CategoryPage),
      },

      // Guest-only routes (redirect authenticated users away)
      {
        element: <GuestRoute />,
        children: [
          {
            path: 'login',
            element: wrap(LoginPage),
          },
          {
            path: 'register',
            element: wrap(RegisterPage),
          },
          {
            path: 'forgot-password',
            element: wrap(ForgotPasswordPage),
          },
          {
            path: 'reset-password',
            element: wrap(ResetPasswordPage),
          },
        ],
      },

      // Protected routes (require authentication)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'cart',
            element: wrap(CartPage),
          },
          {
            path: 'checkout',
            children: [
              {
                path: 'review',
                element: wrap(CheckoutReviewPage),
              },
              {
                path: 'address',
                element: wrap(CheckoutAddressPage),
              },
              {
                path: 'place-order',
                element: wrap(CheckoutPlaceOrderPage),
              },
            ],
          },
          {
            path: 'payment',
            element: wrap(PaymentPage),
          },
          {
            path: 'orders',
            children: [
              {
                index: true,
                element: wrap(OrdersPage),
              },
              {
                path: ':orderId',
                element: wrap(OrderDetailPage),
              },
              {
                path: ':orderId/tracking',
                element: wrap(OrderTrackingPage),
              },
              {
                path: ':orderId/return',
                element: wrap(ReturnRequestPage),
              },
            ],
          },
          {
            path: 'account',
            children: [
              {
                path: 'profile',
                element: wrap(ProfilePage),
              },
              {
                path: 'addresses',
                element: wrap(AddressesPage),
              },
              {
                path: 'change-password',
                element: wrap(ChangePasswordPage),
              },
            ],
          },
          {
            path: 'notifications',
            element: wrap(NotificationsPage),
          },
        ],
      },

      // Admin routes (require admin role)
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: wrap(AdminDashboardPage),
          },
          {
            path: 'products',
            element: wrap(AdminProductsPage),
          },
          {
            path: 'categories',
            element: wrap(AdminCategoriesPage),
          },
          {
            path: 'brands',
            element: wrap(AdminBrandsPage),
          },
          {
            path: 'orders',
            element: wrap(AdminOrdersPage),
          },
          {
            path: 'returns',
            element: wrap(AdminReturnsPage),
          },
          {
            path: 'promo-codes',
            element: wrap(AdminPromoCodesPage),
          },
          {
            path: 'reports',
            element: wrap(AdminReportsPage),
          },
        ],
      },

      // Error pages
      {
        path: '403',
        element: wrap(ForbiddenPage),
      },
      {
        path: '*',
        element: wrap(NotFoundPage),
      },
    ],
  },
]);

export default router;
