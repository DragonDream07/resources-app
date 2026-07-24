import api from './api';

export const getCart = (cartId) =>
  api.get(`/carts/${cartId}`).then((res) => res.data);

export const addCartItem = (cartId, data) =>
  api.post(`/carts/${cartId}/items`, data).then((res) => res.data);

export const updateCartItem = (cartId, itemId, data) =>
  api.patch(`/carts/${cartId}/items/${itemId}`, data).then((res) => res.data);

export const deleteCartItem = (cartId, itemId) =>
  api.delete(`/carts/${cartId}/items/${itemId}`).then((res) => res.data);

export const applyPromo = (cartId, data) =>
  api.post(`/carts/${cartId}/promo`, data).then((res) => res.data);

export default {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  applyPromo,
};
