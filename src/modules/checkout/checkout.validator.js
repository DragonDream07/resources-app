const Joi = require('joi');
const { AppError } = require('../../utils/errors');

// ─── Schemas ──────────────────────────────────────────────────────────────────

const checkoutStartSchema = Joi.object({
  cartId: Joi.string().uuid().required().messages({
    'string.base': 'cartId must be a string.',
    'string.guid': 'cartId must be a valid UUID.',
    'any.required': 'cartId is required.',
  }),
  guestEmail: Joi.string().email().optional().allow(null, '').messages({
    'string.email': 'guestEmail must be a valid email address.',
  }),
});

const addressSchema = Joi.object({
  fullName: Joi.string().min(2).max(120).required().messages({
    'string.base': 'fullName must be a string.',
    'string.min': 'fullName must be at least 2 characters.',
    'string.max': 'fullName must not exceed 120 characters.',
    'any.required': 'fullName is required.',
  }),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.base': 'phone must be a string.',
      'string.pattern.base': 'Phone number must be a valid 10-digit Indian mobile number.',
      'any.required': 'phone is required.',
    }),
  line1: Joi.string().min(5).max(255).required().messages({
    'string.base': 'line1 must be a string.',
    'string.min': 'line1 must be at least 5 characters.',
    'string.max': 'line1 must not exceed 255 characters.',
    'any.required': 'line1 is required.',
  }),
  line2: Joi.string().max(255).optional().allow(null, '').messages({
    'string.max': 'line2 must not exceed 255 characters.',
  }),
  city: Joi.string().min(2).max(100).required().messages({
    'string.base': 'city must be a string.',
    'string.min': 'city must be at least 2 characters.',
    'string.max': 'city must not exceed 100 characters.',
    'any.required': 'city is required.',
  }),
  state: Joi.string().min(2).max(100).required().messages({
    'string.base': 'state must be a string.',
    'string.min': 'state must be at least 2 characters.',
    'string.max': 'state must not exceed 100 characters.',
    'any.required': 'state is required.',
  }),
  country: Joi.string().min(2).max(100).required().messages({
    'string.base': 'country must be a string.',
    'string.min': 'country must be at least 2 characters.',
    'string.max': 'country must not exceed 100 characters.',
    'any.required': 'country is required.',
  }),
  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.base': 'pincode must be a string.',
      'string.pattern.base': 'Pincode must be a 6-digit number.',
      'any.required': 'pincode is required.',
    }),
});

const checkoutAddressSchema = Joi.object({
  checkoutSessionId: Joi.string().uuid().required().messages({
    'string.base': 'checkoutSessionId must be a string.',
    'string.guid': 'checkoutSessionId must be a valid UUID.',
    'any.required': 'checkoutSessionId is required.',
  }),
  address: addressSchema.required().messages({
    'any.required': 'address is required.',
  }),
});

const checkoutPlaceOrderSchema = Joi.object({
  checkoutSessionId: Joi.string().uuid().required().messages({
    'string.base': 'checkoutSessionId must be a string.',
    'string.guid': 'checkoutSessionId must be a valid UUID.',
    'any.required': 'checkoutSessionId is required.',
  }),
  paymentMethod: Joi.string()
    .valid('card', 'upi', 'netbanking', 'cod', 'wallet')
    .required()
    .messages({
      'string.base': 'paymentMethod must be a string.',
      'any.only': 'paymentMethod must be one of: card, upi, netbanking, cod, wallet.',
      'any.required': 'paymentMethod is required.',
    }),
  paymentDetails: Joi.object().optional().allow(null).messages({
    'object.base': 'paymentDetails must be an object.',
  }),
});

// ─── Middleware factories ─────────────────────────────────────────────────────

function _makeValidator(schema) {
  return function (req, res, next) {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map((d) => d.message).join('; ');
      return next(new AppError(messages, 400));
    }
    req.body = value;
    next();
  };
}

const validateCheckoutStart = _makeValidator(checkoutStartSchema);
const validateCheckoutAddress = _makeValidator(checkoutAddressSchema);
const validateCheckoutPlaceOrder = _makeValidator(checkoutPlaceOrderSchema);

module.exports = {
  checkoutStartSchema,
  checkoutAddressSchema,
  checkoutPlaceOrderSchema,
  validateCheckoutStart,
  validateCheckoutAddress,
  validateCheckoutPlaceOrder,
};
