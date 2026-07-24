/**
 * Environment configuration
 * Reads Vite import.meta.env variables and exports typed constants.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

export const IS_PRODUCTION = APP_ENV === 'production';

export const IS_DEVELOPMENT = APP_ENV === 'development';

export const ENABLE_MOCK_PAYMENTS = import.meta.env.VITE_ENABLE_MOCK_PAYMENTS === 'true';

export const GUEST_CHECKOUT_ENABLED = import.meta.env.VITE_GUEST_CHECKOUT_ENABLED !== 'false';

export const DEFAULT_CURRENCY = import.meta.env.VITE_DEFAULT_CURRENCY || 'INR';

export const DEFAULT_LOCALE = import.meta.env.VITE_DEFAULT_LOCALE || 'en-IN';

export const PAGINATION_PAGE_SIZE = Number(import.meta.env.VITE_PAGINATION_PAGE_SIZE) || 20;

export const SEARCH_DEBOUNCE_MS = Number(import.meta.env.VITE_SEARCH_DEBOUNCE_MS) || 300;

export const TOAST_DURATION_MS = Number(import.meta.env.VITE_TOAST_DURATION_MS) || 4000;
