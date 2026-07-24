const Joi = require('joi');

const createAddress = Joi.object({
  full_name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Full name is required.',
    'any.required': 'Full name is required.',
    'string.max': 'Full name must not exceed 100 characters.',
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required.',
      'any.required': 'Phone number is required.',
      'string.pattern.base': 'Phone number must be a valid 10-digit Indian mobile number.',
    }),
  address_line1: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Address line 1 is required.',
    'any.required': 'Address line 1 is required.',
    'string.max': 'Address line 1 must not exceed 255 characters.',
  }),
  address_line2: Joi.string().trim().max(255).optional().allow('', null).messages({
    'string.max': 'Address line 2 must not exceed 255 characters.',
  }),
  city: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'City is required.',
    'any.required': 'City is required.',
    'string.max': 'City must not exceed 100 characters.',
  }),
  state: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'State is required.',
    'any.required': 'State is required.',
    'string.max': 'State must not exceed 100 characters.',
  }),
  pin_code: Joi.string()
    .trim()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.empty': 'Pin code is required.',
      'any.required': 'Pin code is required.',
      'string.pattern.base': 'Pin code must be a valid 6-digit code.',
    }),
  country: Joi.string().trim().max(100).optional().default('India').messages({
    'string.max': 'Country must not exceed 100 characters.',
  }),
  is_default: Joi.boolean().optional().default(false),
});

const updateAddress = Joi.object({
  full_name: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'Full name must not be empty.',
    'string.max': 'Full name must not exceed 100 characters.',
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({
      'string.empty': 'Phone number must not be empty.',
      'string.pattern.base': 'Phone number must be a valid 10-digit Indian mobile number.',
    }),
  address_line1: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Address line 1 must not be empty.',
    'string.max': 'Address line 1 must not exceed 255 characters.',
  }),
  address_line2: Joi.string().trim().max(255).optional().allow('', null).messages({
    'string.max': 'Address line 2 must not exceed 255 characters.',
  }),
  city: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'City must not be empty.',
    'string.max': 'City must not exceed 100 characters.',
  }),
  state: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'State must not be empty.',
    'string.max': 'State must not exceed 100 characters.',
  }),
  pin_code: Joi.string()
    .trim()
    .pattern(/^\d{6}$/)
    .optional()
    .messages({
      'string.empty': 'Pin code must not be empty.',
      'string.pattern.base': 'Pin code must be a valid 6-digit code.',
    }),
  country: Joi.string().trim().max(100).optional().messages({
    'string.max': 'Country must not exceed 100 characters.',
  }),
  is_default: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.',
});

module.exports = {
  createAddress,
  updateAddress,
};
