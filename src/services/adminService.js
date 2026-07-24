import api from './api';
import usersService from './usersService';
import ordersService from './ordersService';
import returnsService from './returnsService';
import promotionsService from './promotionsService';
import catalogueService from './catalogueService';

// Dashboard stats
export const getDashboardStats = (params) =>
  api.get('/admin/stats', { params }).then((res) => res.data);

// Reports
export const getReports = (params) =>
  api.get('/admin/reports', { params }).then((res) => res.data);

// Delegated domain calls
export const getUsers = (params) => usersService.adminGetUsers(params);
export const getUser = (userId) => usersService.adminGetUser(userId);
export const updateUser = (userId, data) => usersService.adminUpdateUser(userId, data);
export const deleteUser = (userId) => usersService.adminDeleteUser(userId);

export const getOrders = (params) => ordersService.adminGetOrders(params);
export const getOrder = (orderId) => ordersService.adminGetOrder(orderId);
export const advanceOrder = (orderId, data) => ordersService.adminAdvanceOrder(orderId, data);

export const getReturnRequests = (params) => returnsService.adminGetReturnRequests(params);
export const reviewReturnRequest = (returnRequestId, data) =>
  returnsService.adminReviewReturnRequest(returnRequestId, data);

export const getPromoCodes = (params) => promotionsService.adminGetPromoCodes(params);
export const createPromoCode = (data) => promotionsService.adminCreatePromoCode(data);
export const updatePromoCode = (promoCodeId, data) =>
  promotionsService.adminUpdatePromoCode(promoCodeId, data);
export const deletePromoCode = (promoCodeId) =>
  promotionsService.adminDeletePromoCode(promoCodeId);

export const getProducts = (params) => catalogueService.getProducts(params);
export const getProduct = (productId) => catalogueService.getProduct(productId);
export const createProduct = (data) => catalogueService.adminCreateProduct(data);
export const updateProduct = (productId, data) =>
  catalogueService.adminUpdateProduct(productId, data);
export const deleteProduct = (productId) => catalogueService.adminDeleteProduct(productId);

export const getCategories = (params) => catalogueService.getCategories(params);
export const createCategory = (data) => catalogueService.adminCreateCategory(data);
export const updateCategory = (categoryId, data) =>
  catalogueService.adminUpdateCategory(categoryId, data);
export const deleteCategory = (categoryId) => catalogueService.adminDeleteCategory(categoryId);

export const getBrands = (params) => catalogueService.getBrands(params);
export const createBrand = (data) => catalogueService.adminCreateBrand(data);

export default {
  getDashboardStats,
  getReports,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getOrders,
  getOrder,
  advanceOrder,
  getReturnRequests,
  reviewReturnRequest,
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBrands,
  createBrand,
};
