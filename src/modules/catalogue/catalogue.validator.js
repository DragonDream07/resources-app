const Joi = require('joi');

// ─── Param Schemas ───────────────────────────────────────────────────────────

const productIdParamSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    'string.guid': 'productId must be a valid UUID',
    'any.required': 'productId is required',
  }),
});

const skuIdParamSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    'string.guid': 'productId must be a valid UUID',
    'any.required': 'productId is required',
  }),
  skuId: Joi.string().uuid().required().messages({
    'string.guid': 'skuId must be a valid UUID',
    'any.required': 'skuId is required',
  }),
});

const imageIdParamSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    'string.guid': 'productId must be a valid UUID',
    'any.required': 'productId is required',
  }),
  imageId: Joi.string().uuid().required().messages({
    'string.guid': 'imageId must be a valid UUID',
    'any.required': 'imageId is required',
  }),
});

const categoryIdParamSchema = Joi.object({
  categoryId: Joi.string().uuid().required().messages({
    'string.guid': 'categoryId must be a valid UUID',
    'any.required': 'categoryId is required',
  }),
});

const brandIdParamSchema = Joi.object({
  brandId: Joi.string().uuid().required().messages({
    'string.guid': 'brandId must be a valid UUID',
    'any.required': 'brandId is required',
  }),
});

// ─── Query Schemas ───────────────────────────────────────────────────────────

const productListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'page must be a number',
    'number.integer': 'page must be an integer',
    'number.min': 'page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    'number.base': 'limit must be a number',
    'number.integer': 'limit must be an integer',
    'number.min': 'limit must be at least 1',
    'number.max': 'limit must not exceed 100',
  }),
  categoryId: Joi.string().uuid().optional().messages({
    'string.guid': 'categoryId must be a valid UUID',
  }),
  brandId: Joi.string().uuid().optional().messages({
    'string.guid': 'brandId must be a valid UUID',
  }),
  search: Joi.string().max(200).optional().messages({
    'string.max': 'search must not exceed 200 characters',
  }),
  minPrice: Joi.number().min(0).optional().messages({
    'number.base': 'minPrice must be a number',
    'number.min': 'minPrice must be at least 0',
  }),
  maxPrice: Joi.number().min(0).optional().messages({
    'number.base': 'maxPrice must be a number',
    'number.min': 'maxPrice must be at least 0',
  }),
  sortBy: Joi.string().valid('price', 'name', 'created_at').optional().messages({
    'any.only': 'sortBy must be one of price, name, created_at',
  }),
  sortDir: Joi.string().valid('asc', 'desc').optional().messages({
    'any.only': 'sortDir must be one of asc, desc',
  }),
});

const categoryProductsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'page must be a number',
    'number.integer': 'page must be an integer',
    'number.min': 'page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    'number.base': 'limit must be a number',
    'number.integer': 'limit must be an integer',
    'number.min': 'limit must be at least 1',
    'number.max': 'limit must not exceed 100',
  }),
  brandId: Joi.string().uuid().optional().messages({
    'string.guid': 'brandId must be a valid UUID',
  }),
  search: Joi.string().max(200).optional().messages({
    'string.max': 'search must not exceed 200 characters',
  }),
  sortBy: Joi.string().valid('price', 'name', 'created_at').optional().messages({
    'any.only': 'sortBy must be one of price, name, created_at',
  }),
  sortDir: Joi.string().valid('asc', 'desc').optional().messages({
    'any.only': 'sortDir must be one of asc, desc',
  }),
});

// ─── Product Body Schemas ────────────────────────────────────────────────────

const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name is required',
    'string.min': 'Product name must be at least 1 character',
    'string.max': 'Product name must not exceed 255 characters',
    'any.required': 'Product name is required',
  }),
  description: Joi.string().max(5000).optional().allow('', null).messages({
    'string.max': 'Description must not exceed 5000 characters',
  }),
  base_price: Joi.number().min(0).required().messages({
    'number.base': 'Base price must be a number',
    'number.min': 'Base price must be at least 0',
    'any.required': 'Base price is required',
  }),
  brand_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'brand_id must be a valid UUID',
  }),
  category_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'category_id must be a valid UUID',
  }),
  is_active: Joi.boolean().optional().default(true).messages({
    'boolean.base': 'is_active must be a boolean',
  }),
  attributes: Joi.object().optional().allow(null).messages({
    'object.base': 'attributes must be an object',
  }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional().messages({
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name must not be empty',
    'string.min': 'Product name must be at least 1 character',
    'string.max': 'Product name must not exceed 255 characters',
  }),
  description: Joi.string().max(5000).optional().allow('', null).messages({
    'string.max': 'Description must not exceed 5000 characters',
  }),
  base_price: Joi.number().min(0).optional().messages({
    'number.base': 'Base price must be a number',
    'number.min': 'Base price must be at least 0',
  }),
  brand_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'brand_id must be a valid UUID',
  }),
  category_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'category_id must be a valid UUID',
  }),
  is_active: Joi.boolean().optional().messages({
    'boolean.base': 'is_active must be a boolean',
  }),
  attributes: Joi.object().optional().allow(null).messages({
    'object.base': 'attributes must be an object',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ─── SKU Body Schemas ────────────────────────────────────────────────────────

const createSkuSchema = Joi.object({
  sku_code: Joi.string().min(1).max(100).required().messages({
    'string.base': 'SKU code must be a string',
    'string.empty': 'SKU code is required',
    'string.min': 'SKU code must be at least 1 character',
    'string.max': 'SKU code must not exceed 100 characters',
    'any.required': 'SKU code is required',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 0',
    'any.required': 'Price is required',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().default(0).messages({
    'number.base': 'Stock quantity must be a number',
    'number.integer': 'Stock quantity must be an integer',
    'number.min': 'Stock quantity must be at least 0',
  }),
  attributes: Joi.object().optional().allow(null).messages({
    'object.base': 'attributes must be an object',
  }),
  is_active: Joi.boolean().optional().default(true).messages({
    'boolean.base': 'is_active must be a boolean',
  }),
});

const updateSkuSchema = Joi.object({
  sku_code: Joi.string().min(1).max(100).optional().messages({
    'string.base': 'SKU code must be a string',
    'string.empty': 'SKU code must not be empty',
    'string.min': 'SKU code must be at least 1 character',
    'string.max': 'SKU code must not exceed 100 characters',
  }),
  price: Joi.number().min(0).optional().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 0',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock quantity must be a number',
    'number.integer': 'Stock quantity must be an integer',
    'number.min': 'Stock quantity must be at least 0',
  }),
  attributes: Joi.object().optional().allow(null).messages({
    'object.base': 'attributes must be an object',
  }),
  is_active: Joi.boolean().optional().messages({
    'boolean.base': 'is_active must be a boolean',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ─── Category Body Schemas ───────────────────────────────────────────────────

const createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.base': 'Category name must be a string',
    'string.empty': 'Category name is required',
    'string.min': 'Category name must be at least 1 character',
    'string.max': 'Category name must not exceed 255 characters',
    'any.required': 'Category name is required',
  }),
  description: Joi.string().max(2000).optional().allow('', null).messages({
    'string.max': 'Description must not exceed 2000 characters',
  }),
  parent_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'parent_id must be a valid UUID',
  }),
  image_url: Joi.string().uri().max(2048).optional().allow('', null).messages({
    'string.uri': 'image_url must be a valid URL',
    'string.max': 'image_url must not exceed 2048 characters',
  }),
  is_active: Joi.boolean().optional().default(true).messages({
    'boolean.base': 'is_active must be a boolean',
  }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(255).optional().messages({
    'string.base': 'Category name must be a string',
    'string.empty': 'Category name must not be empty',
    'string.min': 'Category name must be at least 1 character',
    'string.max': 'Category name must not exceed 255 characters',
  }),
  description: Joi.string().max(2000).optional().allow('', null).messages({
    'string.max': 'Description must not exceed 2000 characters',
  }),
  parent_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'parent_id must be a valid UUID',
  }),
  image_url: Joi.string().uri().max(2048).optional().allow('', null).messages({
    'string.uri': 'image_url must be a valid URL',
    'string.max': 'image_url must not exceed 2048 characters',
  }),
  is_active: Joi.boolean().optional().messages({
    'boolean.base': 'is_active must be a boolean',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ─── Brand Body Schemas ──────────────────────────────────────────────────────

const createBrandSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.base': 'Brand name must be a string',
    'string.empty': 'Brand name is required',
    'string.min': 'Brand name must be at least 1 character',
    'string.max': 'Brand name must not exceed 255 characters',
    'any.required': 'Brand name is required',
  }),
  description: Joi.string().max(2000).optional().allow('', null).messages({
    'string.max': 'Description must not exceed 2000 characters',
  }),
  logo_url: Joi.string().uri().max(2048).optional().allow('', null).messages({
    'string.uri': 'logo_url must be a valid URL',
    'string.max': 'logo_url must not exceed 2048 characters',
  }),
  is_active: Joi.boolean().optional().default(true).messages({
    'boolean.base': 'is_active must be a boolean',
  }),
});

const updateBrandSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional().messages({
    'string.base': 'Brand name must be a string',
    'string.empty': 'Brand name must not be empty',
    'string.min': 'Brand name must be at least 1 character',
    'string.max': 'Brand name must not exceed 255 characters',
  }),
  description: Joi.string().max(2000).optional().allow('', null).messages({
    'string.max': 'Description must not exceed 2000 characters',
  }),
  logo_url: Joi.string().uri().max(2048).optional().allow('', null).messages({
    'string.uri': 'logo_url must be a valid URL',
    'string.max': 'logo_url must not exceed 2048 characters',
  }),
  is_active: Joi.boolean().optional().messages({
    'boolean.base': 'is_active must be a boolean',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ─── Product Image Body Schema ────────────────────────────────────────────────

const productImageSchema = Joi.object({
  url: Joi.string().uri().max(2048).required().messages({
    'string.base': 'Image URL must be a string',
    'string.empty': 'Image URL is required',
    'string.uri': 'Image URL must be a valid URL',
    'string.max': 'Image URL must not exceed 2048 characters',
    'any.required': 'Image URL is required',
  }),
  alt_text: Joi.string().max(255).optional().allow('', null).messages({
    'string.max': 'alt_text must not exceed 255 characters',
  }),
  sort_order: Joi.number().integer().min(0).optional().default(0).messages({
    'number.base': 'sort_order must be a number',
    'number.integer': 'sort_order must be an integer',
    'number.min': 'sort_order must be at least 0',
  }),
  is_primary: Joi.boolean().optional().default(false).messages({
    'boolean.base': 'is_primary must be a boolean',
  }),
});

module.exports = {
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
};
