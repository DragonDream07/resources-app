const express = require('express');
const router = express.Router();
const catalogueController = require('./catalogue.controller');
const { validateBody, validateParams, validateQuery } = require('../../middleware/validate');
const { authenticate, authorize } = require('../../middleware/auth');
const {
  createProductSchema,
  updateProductSchema,
  createSkuSchema,
  updateSkuSchema,
  createCategorySchema,
  updateCategorySchema,
  createBrandSchema,
  updateBrandSchema,
  productImageSchema,
  productIdParamSchema,
  skuIdParamSchema,
  imageIdParamSchema,
  categoryIdParamSchema,
  brandIdParamSchema,
  productListQuerySchema,
  categoryProductsQuerySchema,
} = require('./catalogue.validator');

// ─── Public: Products ───────────────────────────────────────────────────────
router.get('/products', validateQuery(productListQuerySchema), catalogueController.listProducts);
router.get('/products/:productId', validateParams(productIdParamSchema), catalogueController.getProduct);
router.get('/products/:productId/skus', validateParams(productIdParamSchema), catalogueController.listSkus);
router.get('/products/:productId/skus/:skuId', validateParams(skuIdParamSchema), catalogueController.getSku);
router.get('/products/:productId/images', validateParams(productIdParamSchema), catalogueController.listProductImages);

// ─── Public: Categories ──────────────────────────────────────────────────────
router.get('/categories', catalogueController.listCategories);
router.get('/categories/:categoryId', validateParams(categoryIdParamSchema), catalogueController.getCategory);
router.get('/categories/:categoryId/products', validateParams(categoryIdParamSchema), validateQuery(categoryProductsQuerySchema), catalogueController.listCategoryProducts);

// ─── Public: Brands ──────────────────────────────────────────────────────────
router.get('/brands', catalogueController.listBrands);
router.get('/brands/:brandId', validateParams(brandIdParamSchema), catalogueController.getBrand);

// ─── Admin: Products ─────────────────────────────────────────────────────────
router.post('/products', authenticate, authorize('admin'), validateBody(createProductSchema), catalogueController.createProduct);
router.put('/products/:productId', authenticate, authorize('admin'), validateParams(productIdParamSchema), validateBody(updateProductSchema), catalogueController.updateProduct);
router.delete('/products/:productId', authenticate, authorize('admin'), validateParams(productIdParamSchema), catalogueController.deleteProduct);

// ─── Admin: SKUs ─────────────────────────────────────────────────────────────
router.post('/products/:productId/skus', authenticate, authorize('admin'), validateParams(productIdParamSchema), validateBody(createSkuSchema), catalogueController.createSku);
router.put('/products/:productId/skus/:skuId', authenticate, authorize('admin'), validateParams(skuIdParamSchema), validateBody(updateSkuSchema), catalogueController.updateSku);
router.delete('/products/:productId/skus/:skuId', authenticate, authorize('admin'), validateParams(skuIdParamSchema), catalogueController.deleteSku);

// ─── Admin: Product Images ───────────────────────────────────────────────────
router.post('/products/:productId/images', authenticate, authorize('admin'), validateParams(productIdParamSchema), validateBody(productImageSchema), catalogueController.addProductImage);
router.delete('/products/:productId/images/:imageId', authenticate, authorize('admin'), validateParams(imageIdParamSchema), catalogueController.deleteProductImage);

// ─── Admin: Categories ───────────────────────────────────────────────────────
router.post('/categories', authenticate, authorize('admin'), validateBody(createCategorySchema), catalogueController.createCategory);
router.put('/categories/:categoryId', authenticate, authorize('admin'), validateParams(categoryIdParamSchema), validateBody(updateCategorySchema), catalogueController.updateCategory);
router.delete('/categories/:categoryId', authenticate, authorize('admin'), validateParams(categoryIdParamSchema), catalogueController.deleteCategory);

// ─── Admin: Brands ───────────────────────────────────────────────────────────
router.post('/brands', authenticate, authorize('admin'), validateBody(createBrandSchema), catalogueController.createBrand);
router.put('/brands/:brandId', authenticate, authorize('admin'), validateParams(brandIdParamSchema), validateBody(updateBrandSchema), catalogueController.updateBrand);
router.delete('/brands/:brandId', authenticate, authorize('admin'), validateParams(brandIdParamSchema), catalogueController.deleteBrand);

module.exports = router;
