const catalogueService = require('./catalogue.service');
const { sendSuccess, sendError } = require('../../utils/response');

// ─── Products ────────────────────────────────────────────────────────────────

async function listProducts(req, res) {
  try {
    const result = await catalogueService.listProducts(req.query);
    return sendSuccess(res, 200, result);
  } catch (err) {
    return sendError(res, err);
  }
}

async function getProduct(req, res) {
  try {
    const product = await catalogueService.getProduct(req.params.productId);
    return sendSuccess(res, 200, product);
  } catch (err) {
    return sendError(res, err);
  }
}

async function createProduct(req, res) {
  try {
    const product = await catalogueService.createProduct(req.body);
    return sendSuccess(res, 201, product);
  } catch (err) {
    return sendError(res, err);
  }
}

async function updateProduct(req, res) {
  try {
    const product = await catalogueService.updateProduct(req.params.productId, req.body);
    return sendSuccess(res, 200, product);
  } catch (err) {
    return sendError(res, err);
  }
}

async function deleteProduct(req, res) {
  try {
    await catalogueService.deleteProduct(req.params.productId);
    return sendSuccess(res, 204, null);
  } catch (err) {
    return sendError(res, err);
  }
}

// ─── SKUs ────────────────────────────────────────────────────────────────────

async function listSkus(req, res) {
  try {
    const skus = await catalogueService.listSkus(req.params.productId);
    return sendSuccess(res, 200, skus);
  } catch (err) {
    return sendError(res, err);
  }
}

async function getSku(req, res) {
  try {
    const sku = await catalogueService.getSku(req.params.productId, req.params.skuId);
    return sendSuccess(res, 200, sku);
  } catch (err) {
    return sendError(res, err);
  }
}

async function createSku(req, res) {
  try {
    const sku = await catalogueService.createSku(req.params.productId, req.body);
    return sendSuccess(res, 201, sku);
  } catch (err) {
    return sendError(res, err);
  }
}

async function updateSku(req, res) {
  try {
    const sku = await catalogueService.updateSku(req.params.productId, req.params.skuId, req.body);
    return sendSuccess(res, 200, sku);
  } catch (err) {
    return sendError(res, err);
  }
}

async function deleteSku(req, res) {
  try {
    await catalogueService.deleteSku(req.params.productId, req.params.skuId);
    return sendSuccess(res, 204, null);
  } catch (err) {
    return sendError(res, err);
  }
}

// ─── Product Images ──────────────────────────────────────────────────────────

async function listProductImages(req, res) {
  try {
    const images = await catalogueService.listProductImages(req.params.productId);
    return sendSuccess(res, 200, images);
  } catch (err) {
    return sendError(res, err);
  }
}

async function addProductImage(req, res) {
  try {
    const image = await catalogueService.addProductImage(req.params.productId, req.body);
    return sendSuccess(res, 201, image);
  } catch (err) {
    return sendError(res, err);
  }
}

async function deleteProductImage(req, res) {
  try {
    await catalogueService.deleteProductImage(req.params.productId, req.params.imageId);
    return sendSuccess(res, 204, null);
  } catch (err) {
    return sendError(res, err);
  }
}

// ─── Categories ──────────────────────────────────────────────────────────────

async function listCategories(req, res) {
  try {
    const categories = await catalogueService.listCategories();
    return sendSuccess(res, 200, categories);
  } catch (err) {
    return sendError(res, err);
  }
}

async function getCategory(req, res) {
  try {
    const category = await catalogueService.getCategory(req.params.categoryId);
    return sendSuccess(res, 200, category);
  } catch (err) {
    return sendError(res, err);
  }
}

async function createCategory(req, res) {
  try {
    const category = await catalogueService.createCategory(req.body);
    return sendSuccess(res, 201, category);
  } catch (err) {
    return sendError(res, err);
  }
}

async function updateCategory(req, res) {
  try {
    const category = await catalogueService.updateCategory(req.params.categoryId, req.body);
    return sendSuccess(res, 200, category);
  } catch (err) {
    return sendError(res, err);
  }
}

async function deleteCategory(req, res) {
  try {
    await catalogueService.deleteCategory(req.params.categoryId);
    return sendSuccess(res, 204, null);
  } catch (err) {
    return sendError(res, err);
  }
}

async function listCategoryProducts(req, res) {
  try {
    const result = await catalogueService.listCategoryProducts(req.params.categoryId, req.query);
    return sendSuccess(res, 200, result);
  } catch (err) {
    return sendError(res, err);
  }
}

// ─── Brands ──────────────────────────────────────────────────────────────────

async function listBrands(req, res) {
  try {
    const brands = await catalogueService.listBrands();
    return sendSuccess(res, 200, brands);
  } catch (err) {
    return sendError(res, err);
  }
}

async function getBrand(req, res) {
  try {
    const brand = await catalogueService.getBrand(req.params.brandId);
    return sendSuccess(res, 200, brand);
  } catch (err) {
    return sendError(res, err);
  }
}

async function createBrand(req, res) {
  try {
    const brand = await catalogueService.createBrand(req.body);
    return sendSuccess(res, 201, brand);
  } catch (err) {
    return sendError(res, err);
  }
}

async function updateBrand(req, res) {
  try {
    const brand = await catalogueService.updateBrand(req.params.brandId, req.body);
    return sendSuccess(res, 200, brand);
  } catch (err) {
    return sendError(res, err);
  }
}

async function deleteBrand(req, res) {
  try {
    await catalogueService.deleteBrand(req.params.brandId);
    return sendSuccess(res, 204, null);
  } catch (err) {
    return sendError(res, err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listSkus,
  getSku,
  createSku,
  updateSku,
  deleteSku,
  listProductImages,
  addProductImage,
  deleteProductImage,
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  listCategoryProducts,
  listBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
