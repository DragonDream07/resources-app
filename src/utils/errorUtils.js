/**
 * Parses API error responses into user-facing messages.
 */

/**
 * Default fallback message when no specific error can be extracted.
 */
export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * HTTP status code to generic user-facing message map.
 */
const STATUS_MESSAGES = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'You are not authorised. Please log in and try again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'A conflict occurred. The resource may already exist.',
  422: 'Validation failed. Please check your input.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'An internal server error occurred. Please try again later.',
  502: 'Service temporarily unavailable. Please try again later.',
  503: 'Service temporarily unavailable. Please try again later.',
};

/**
 * Extracts a user-facing error message from an Axios (or fetch) error object.
 *
 * Priority order:
 *  1. `error.response.data.message` (string)
 *  2. `error.response.data.detail` (string, FastAPI default)
 *  3. `error.response.data.errors[0].message` (array of field errors)
 *  4. HTTP status code generic message
 *  5. `error.message`
 *  6. DEFAULT_ERROR_MESSAGE
 *
 * @param {unknown} error - The error thrown by the API call.
 * @returns {string} A user-facing error message.
 */
export function parseApiError(error) {
  if (!error) return DEFAULT_ERROR_MESSAGE;

  // Axios-style error with response
  if (error.response) {
    const { data, status } = error.response;

    if (data) {
      // FastAPI / DRF message field
      if (typeof data.message === 'string' && data.message) {
        return data.message;
      }

      // FastAPI detail field (may be string or array)
      if (typeof data.detail === 'string' && data.detail) {
        return data.detail;
      }

      if (Array.isArray(data.detail) && data.detail.length > 0) {
        const first = data.detail[0];
        if (typeof first === 'string') return first;
        if (first && typeof first.msg === 'string') return first.msg;
      }

      // Array of field validation errors
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        if (typeof first.message === 'string') return first.message;
        if (typeof first.msg === 'string') return first.msg;
      }
    }

    // Fall back to status-based message
    if (STATUS_MESSAGES[status]) {
      return STATUS_MESSAGES[status];
    }
  }

  // Network / timeout errors (no response)
  if (error.request && !error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  // Generic JS Error
  if (typeof error.message === 'string' && error.message) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Extracts a map of field-level validation errors from an API response.
 * Useful for setting form errors programmatically.
 *
 * Returns an object like: { email: 'Email is already taken.', ... }
 *
 * @param {unknown} error
 * @returns {Record<string, string>}
 */
export function parseFieldErrors(error) {
  const fieldErrors = {};

  if (!error || !error.response || !error.response.data) return fieldErrors;

  const { data } = error.response;

  // FastAPI pydantic validation errors: detail is an array of loc+msg objects
  if (Array.isArray(data.detail)) {
    for (const item of data.detail) {
      if (item && Array.isArray(item.loc) && typeof item.msg === 'string') {
        const field = item.loc[item.loc.length - 1];
        if (typeof field === 'string') {
          fieldErrors[field] = item.msg;
        }
      }
    }
    return fieldErrors;
  }

  // Generic errors array: [{ field, message }]
  if (Array.isArray(data.errors)) {
    for (const item of data.errors) {
      if (item && typeof item.field === 'string' && typeof item.message === 'string') {
        fieldErrors[item.field] = item.message;
      }
    }
    return fieldErrors;
  }

  return fieldErrors;
}

/**
 * Returns true if the error is a 401 Unauthorised response.
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function isUnauthorizedError(error) {
  return error?.response?.status === 401;
}

/**
 * Returns true if the error is a 403 Forbidden response.
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function isForbiddenError(error) {
  return error?.response?.status === 403;
}

/**
 * Returns true if the error is a 404 Not Found response.
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function isNotFoundError(error) {
  return error?.response?.status === 404;
}
