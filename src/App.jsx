import React, { createContext, useContext, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Auth Context
// ---------------------------------------------------------------------------
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }, []);

  const value = { user, token, login, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Cart Context
// ---------------------------------------------------------------------------
export const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

function CartProvider({ children }) {
  const [cartId, setCartId] = useState(() => localStorage.getItem('cart_id') || null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const initCart = useCallback((id) => {
    setCartId(id);
    localStorage.setItem('cart_id', id);
  }, []);

  const updateCart = useCallback((items) => {
    setCartItems(items);
    setCartCount(items.reduce((sum, item) => sum + (item.quantity || 0), 0));
  }, []);

  const clearCart = useCallback(() => {
    setCartId(null);
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem('cart_id');
  }, []);

  const value = { cartId, cartCount, cartItems, initCart, updateCart, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ---------------------------------------------------------------------------
// Notifications Context
// ---------------------------------------------------------------------------
export const NotificationsContext = createContext(null);

export function useNotifications() {
  return useContext(NotificationsContext);
}

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const markRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const setAll = useCallback((items) => {
    setNotifications(items);
    setUnreadCount(items.filter((n) => !n.read).length);
  }, []);

  const value = { notifications, unreadCount, addNotification, markAllRead, markRead, setAll };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

// ---------------------------------------------------------------------------
// Lazy page imports — defined here so routing is centrally managed
// ---------------------------------------------------------------------------
const HomePage = React.lazy(() => import('./pages/HomePage.jsx'));
const SearchPage = React.lazy(() => import('./pages/SearchPage.jsx'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage.jsx'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage.jsx'));
const CartPage = React.lazy(() => import('./pages/CartPage.jsx'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage.jsx'));
const OrderConfirmationPage = React.lazy(() => import('./pages/OrderConfirmationPage.jsx'));
const OrderDetailPage = React.lazy(() => import('./pages/OrderDetailPage.jsx'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage.jsx'));
const LoginPage = React.lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage.jsx'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage.jsx'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage.jsx'));
const AddressesPage = React.lazy(() => import('./pages/AddressesPage.jsx'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage.jsx'));
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage.jsx'));
const AdminProductsPage = React.lazy(() => import('./pages/admin/AdminProductsPage.jsx'));
const AdminCategoriesPage = React.lazy(() => import('./pages/admin/AdminCategoriesPage.jsx'));
const AdminBrandsPage = React.lazy(() => import('./pages/admin/AdminBrandsPage.jsx'));
const AdminOrdersPage = React.lazy(() => import('./pages/admin/AdminOrdersPage.jsx'));
const AdminReturnsPage = React.lazy(() => import('./pages/admin/AdminReturnsPage.jsx'));
const AdminPromoCodesPage = React.lazy(() => import('./pages/admin/AdminPromoCodesPage.jsx'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage.jsx'));

function AppFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root App component
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationsProvider>
            <React.Suspense fallback={<AppFallback />}>
              <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                <Route path="/categories/:categoryId" element={<CategoryPage />} />
                <Route path="/cart" element={<CartPage />} />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Checkout */}
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/confirmation" element={<OrderConfirmationPage />} />

                {/* Account */}
                <Route path="/account/profile" element={<ProfilePage />} />
                <Route path="/account/addresses" element={<AddressesPage />} />
                <Route path="/account/orders" element={<OrdersPage />} />
                <Route path="/account/orders/:orderId" element={<OrderDetailPage />} />
                <Route path="/account/notifications" element={<NotificationsPage />} />

                {/* Admin */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                <Route path="/admin/brands" element={<AdminBrandsPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/returns" element={<AdminReturnsPage />} />
                <Route path="/admin/promo-codes" element={<AdminPromoCodesPage />} />

                {/* Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </React.Suspense>
          </NotificationsProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
