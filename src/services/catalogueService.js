import api from './api';

// Products
export const getProducts = (params) =>
  api.get('/products', { params }).then((res) => res.data);

export const getProduct = (productId) =>
  api.get(`/products/${productId}`).then((res) => res.data);

export const getProductSkus = (productId) =>
  api.get(`/products/${productId}/skus`).then((res) => res.data);

export const getProductImages = (productId) =>
  api.get(`/products/${productId}/images`).then((res) => res.data);

export const getCategoryProducts = (categoryId, params) =>
  api.get(`/categories/${categoryId}/products`, { params }).then((res) => res.data);

// Categories
export const getCategories = (params) =>
  api.get('/categories', { params }).then((res) => res.data);

export const getCategory = (categoryId) =>
  api.get(`/categories/${categoryId}`).then((res) => res.data);

// Brands
export const getBrands = (params) =>
  api.get('/brands', { params }).then((res) => res.data);

export const getBrand = (brandId) =>
  api.get(`/brands/${brandId}`).then((res) => res.data);

// Admin catalogue CRUD
export const adminCreateProduct = (data) =>
  api.post('/products', data).then((res) => res.data);

export const adminUpdateProduct = (productId, data) =>
  api.put(`/products/${productId}`, data).then((res) => res.data);

export const adminDeleteProduct = (productId) =>
  api.delete(`/products/${productId}`).then((res) => res.data);

export const adminUploadProductImages = (productId, data) =>
  api.post(`/products/${productId}/images`, data).then((res) => res.data);

export const adminCreateProductSku = (productId, data) =>
  api.post(`/products/${productId}/skus`, data).then((res) => res.data);

export const adminUpdateProductSku = (productId, skuId, data) =>
  api.put(`/products/${productId}/skus/${skuId}`, data).then((res) => res.data);

export const adminCreateCategory = (data) =>
  api.post('/categories', data).then((res) => res.data);

export const adminUpdateCategory = (categoryId, data) =>
  api.put(`/categories/${categoryId}`, data).then((res) => res.data);

export const adminDeleteCategory = (categoryId) =>
  api.delete(`/categories/${categoryId}`).then((res) => res.data);

export const adminCreateBrand = (data) =>
  api.post('/brands', data).then((res) => res.data);

export default {
  getProducts,
  getProduct,
  getProductSkus,
  getProductImages,
  getCategoryProducts,
  getCategories,
  getCategory,
  getBrands,
  getBrand,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadProductImages,
  adminCreateProductSku,
  adminUpdateProductSku,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminCreateBrand,
};
