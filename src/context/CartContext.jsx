import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import cartService from '../services/cartService';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

const GUEST_CART_KEY = 'guest_cart_id';

function getGuestCartId() {
  return localStorage.getItem(GUEST_CART_KEY) || null;
}

function setGuestCartId(cartId) {
  if (cartId) {
    localStorage.setItem(GUEST_CART_KEY, cartId);
  } else {
    localStorage.removeItem(GUEST_CART_KEY);
  }
}

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useContext(AuthContext);

  const [cart, setCart] = useState(null);
  const [cartId, setCartIdState] = useState(() => getGuestCartId());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCartId = useCallback((id) => {
    setGuestCartId(id);
    setCartIdState(id);
  }, []);

  const fetchCart = useCallback(async (id) => {
    const resolvedId = id || cartId;
    if (!resolvedId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart(resolvedId);
      setCart(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  const initCart = useCallback(async () => {
    if (isAuthenticated && user) {
      const guestId = getGuestCartId();
      try {
        setLoading(true);
        const userCart = await cartService.getUserCart();
        const userCartId = userCart.cartId || userCart.id;
        if (guestId && guestId !== userCartId) {
          try {
            await cartService.mergeCart({ guestCartId: guestId, userCartId });
          } catch {
            // merge failure is non-fatal
          }
          setGuestCartId(null);
        }
        setCartIdState(userCartId);
        const merged = await cartService.getCart(userCartId);
        setCart(merged);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    } else {
      const guestId = getGuestCartId();
      if (guestId) {
        await fetchCart(guestId);
      }
    }
  }, [isAuthenticated, user, fetchCart]);

  useEffect(() => {
    initCart();
  }, [isAuthenticated]);

  const ensureCartId = useCallback(async () => {
    if (cartId) return cartId;
    try {
      const newCart = await cartService.createCart();
      const newId = newCart.cartId || newCart.id;
      updateCartId(newId);
      setCart(newCart);
      return newId;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [cartId, updateCartId]);

  const addItem = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const id = await ensureCartId();
      const updated = await cartService.addItem(id, payload);
      setCart(updated);
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [ensureCartId]);

  const updateItem = useCallback(async (itemId, payload) => {
    if (!cartId) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await cartService.updateItem(cartId, itemId, payload);
      setCart(updated);
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  const removeItem = useCallback(async (itemId) => {
    if (!cartId) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await cartService.removeItem(cartId, itemId);
      setCart(updated);
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  const applyPromo = useCallback(async (promoCode) => {
    if (!cartId) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await cartService.applyPromo(cartId, { promoCode });
      setCart(updated);
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  const clearCart = useCallback(() => {
    setCart(null);
    updateCartId(null);
  }, [updateCartId]);

  const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const value = {
    cart,
    cartId,
    loading,
    error,
    itemCount,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    applyPromo,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
