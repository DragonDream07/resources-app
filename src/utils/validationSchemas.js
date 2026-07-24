import * as Yup from 'yup';

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required.'),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .required('Name is required.'),
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .matches(
      /[A-Z]/,
      'Password must contain at least one uppercase letter.'
    )
    .matches(
      /[0-9]/,
      'Password must contain at least one number.'
    )
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .matches(
      /[A-Z]/,
      'Password must contain at least one uppercase letter.'
    )
    .matches(
      /[0-9]/,
      'Password must contain at least one number.'
    )
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required.'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .matches(
      /[A-Z]/,
      'Password must contain at least one uppercase letter.'
    )
    .matches(
      /[0-9]/,
      'Password must contain at least one number.'
    )
    .required('New password is required.'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match.')
    .required('Please confirm your new password.'),
});

// ---------------------------------------------------------------------------
// Address schema
// ---------------------------------------------------------------------------

export const addressSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters.')
    .max(100, 'Full name must not exceed 100 characters.')
    .required('Full name is required.'),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.')
    .required('Phone number is required.'),
  addressLine1: Yup.string()
    .min(5, 'Address must be at least 5 characters.')
    .max(200, 'Address must not exceed 200 characters.')
    .required('Address line 1 is required.'),
  addressLine2: Yup.string()
    .max(200, 'Address must not exceed 200 characters.')
    .optional(),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters.')
    .max(100, 'City must not exceed 100 characters.')
    .required('City is required.'),
  state: Yup.string()
    .min(2, 'State must be at least 2 characters.')
    .max(100, 'State must not exceed 100 characters.')
    .required('State is required.'),
  pincode: Yup.string()
    .matches(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit PIN code.')
    .required('PIN code is required.'),
  isDefault: Yup.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Profile schema
// ---------------------------------------------------------------------------

export const profileSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .required('Name is required.'),
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.')
    .optional()
    .nullable(),
});

// ---------------------------------------------------------------------------
// Product schema (admin)
// ---------------------------------------------------------------------------

export const productSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Product name must be at least 2 characters.')
    .max(200, 'Product name must not exceed 200 characters.')
    .required('Product name is required.'),
  description: Yup.string()
    .max(5000, 'Description must not exceed 5000 characters.')
    .optional(),
  brandId: Yup.string()
    .required('Brand is required.'),
  categoryId: Yup.string()
    .required('Category is required.'),
  basePrice: Yup.number()
    .min(0, 'Price must be a positive number.')
    .required('Base price is required.'),
  isActive: Yup.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Category schema (admin)
// ---------------------------------------------------------------------------

export const categorySchema = Yup.object({
  name: Yup.string()
    .min(2, 'Category name must be at least 2 characters.')
    .max(100, 'Category name must not exceed 100 characters.')
    .required('Category name is required.'),
  slug: Yup.string()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers and hyphens only.')
    .optional(),
  parentId: Yup.string().nullable().optional(),
});

// ---------------------------------------------------------------------------
// Brand schema (admin)
// ---------------------------------------------------------------------------

export const brandSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Brand name must be at least 2 characters.')
    .max(100, 'Brand name must not exceed 100 characters.')
    .required('Brand name is required.'),
});

// ---------------------------------------------------------------------------
// Promo code schema (admin)
// ---------------------------------------------------------------------------

export const promoCodeSchema = Yup.object({
  code: Yup.string()
    .min(3, 'Promo code must be at least 3 characters.')
    .max(20, 'Promo code must not exceed 20 characters.')
    .matches(/^[A-Z0-9_-]+$/, 'Promo code must contain only uppercase letters, numbers, hyphens and underscores.')
    .required('Promo code is required.'),
  discountType: Yup.string()
    .oneOf(['percentage', 'flat'], 'Discount type must be either percentage or flat.')
    .required('Discount type is required.'),
  discountValue: Yup.number()
    .min(0, 'Discount value must be a positive number.')
    .required('Discount value is required.'),
  minOrderValue: Yup.number()
    .min(0, 'Minimum order value must be a positive number.')
    .optional(),
  maxUses: Yup.number()
    .integer('Maximum uses must be a whole number.')
    .min(1, 'Maximum uses must be at least 1.')
    .optional()
    .nullable(),
  expiresAt: Yup.string().optional().nullable(),
  isActive: Yup.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Guest post-checkout registration schema
// ---------------------------------------------------------------------------

export const guestRegisterSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .required('Name is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .matches(
      /[A-Z]/,
      'Password must contain at least one uppercase letter.'
    )
    .matches(
      /[0-9]/,
      'Password must contain at least one number.'
    )
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
});

// ---------------------------------------------------------------------------
// Return request schema
// ---------------------------------------------------------------------------

export const returnRequestSchema = Yup.object({
  reason: Yup.string()
    .min(10, 'Reason must be at least 10 characters.')
    .max(500, 'Reason must not exceed 500 characters.')
    .required('Reason for return is required.'),
  items: Yup.array()
    .of(
      Yup.object({
        orderItemId: Yup.string().required('Order item is required.'),
        quantity: Yup.number()
          .min(1, 'Quantity must be at least 1.')
          .required('Quantity is required.'),
      })
    )
    .min(1, 'Please select at least one item to return.')
    .required('Items are required.'),
});
