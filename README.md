# Shop Frontend

React + Vite storefront for the Shop application.

---

## Prerequisites

- Node.js >= 18
- npm >= 9

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template and fill in values
cp .env.example .env

# 3. Start development server
npm run dev
```

The dev server starts at `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:8000`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Base URL of the backend REST API (e.g. `http://localhost:8000`) |
| `VITE_APP_ENV` | No | Runtime environment label (`development`, `staging`, `production`) |

All variables must be prefixed with `VITE_` to be exposed to the browser bundle.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Production build output to `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint across all JS/JSX files |
| `npm test` | Run Jest test suite |

---

## Design Tokens

Design tokens are defined in `src/config/tokens.css` and extended into Tailwind via `src/config/tailwind.config.js`.

The root `tailwind.config.js` imports and extends `src/config/tailwind.config.js`.

### Using tokens in components

```jsx
// Tailwind utility classes map directly to design tokens
<button className="bg-primary text-primary-foreground rounded-md px-4 py-2">
  Add to Cart
</button>
```

```css
/* tokens.css CSS custom properties are available globally */
.custom-element {
  color: var(--color-primary);
  font-size: var(--font-size-base);
}
```

### Utility helper

Use `src/utils/cn.js` (wraps `clsx` + `tailwind-merge`) for conditional class composition:

```js
import { cn } from '@/utils/cn';

const cls = cn('base-class', isActive && 'active-class', 'another-class');
```

---

## Route Map

### Public / Storefront

| Path | Component |
|---|---|
| `/` | Home / product listing |
| `/search` | Search results |
| `/categories/:categoryId` | Category page |
| `/categories/:categoryId/products` | Category product listing |
| `/products/:productId` | Product detail |
| `/cart` | `src/pages/cart/Cart.jsx` |
| `/checkout/address` | `src/pages/checkout/CheckoutAddress.jsx` |
| `/checkout/review` | `src/pages/checkout/CheckoutReview.jsx` |
| `/checkout/payment` | `src/pages/checkout/CheckoutPayment.jsx` |
| `/checkout/confirmation` | `src/pages/checkout/CheckoutConfirmation.jsx` |
| `/checkout/guest-register` | `src/pages/checkout/GuestPostCheckoutRegister.jsx` |

### Auth

| Path | Component |
|---|---|
| `/auth/login` | `src/pages/auth/Login.jsx` |
| `/auth/register` | `src/pages/auth/Register.jsx` |
| `/auth/forgot-password` | `src/pages/auth/ForgotPassword.jsx` |
| `/auth/reset-password` | `src/pages/auth/ResetPassword.jsx` |

### Account

| Path | Component |
|---|---|
| `/account` | `src/pages/account/AccountOverview.jsx` |
| `/account/profile` | `src/pages/account/AccountProfile.jsx` |
| `/account/addresses` | `src/pages/account/AccountAddresses.jsx` |
| `/account/addresses/new` | `src/pages/account/AddressNew.jsx` |
| `/account/addresses/:addressId/edit` | `src/pages/account/AddressEdit.jsx` |
| `/account/orders` | `src/pages/account/OrderHistory.jsx` |
| `/account/orders/:orderId` | `src/pages/account/OrderDetail.jsx` |
| `/account/orders/:orderId/return` | `src/pages/account/ReturnRequest.jsx` |
| `/account/notifications` | `src/pages/account/Notifications.jsx` |

### Admin

| Path | Component |
|---|---|
| `/admin` | `src/pages/admin/AdminDashboard.jsx` |
| `/admin/reports` | `src/pages/admin/AdminReports.jsx` |
| `/admin/orders` | `src/pages/admin/orders/AdminOrderList.jsx` |
| `/admin/orders/:orderId` | `src/pages/admin/orders/AdminOrderDetail.jsx` |
| `/admin/catalogue/products` | `src/pages/admin/catalogue/AdminProductList.jsx` |
| `/admin/catalogue/products/new` | `src/pages/admin/catalogue/AdminProductNew.jsx` |
| `/admin/catalogue/products/:productId/edit` | `src/pages/admin/catalogue/AdminProductEdit.jsx` |
| `/admin/catalogue/categories` | `src/pages/admin/catalogue/AdminCategoryList.jsx` |
| `/admin/catalogue/categories/new` | `src/pages/admin/catalogue/AdminCategoryNew.jsx` |
| `/admin/catalogue/categories/:categoryId/edit` | `src/pages/admin/catalogue/AdminCategoryEdit.jsx` |
| `/admin/catalogue/brands` | `src/pages/admin/catalogue/AdminBrandList.jsx` |
| `/admin/catalogue/brands/new` | `src/pages/admin/catalogue/AdminBrandNew.jsx` |
| `/admin/catalogue/brands/:brandId/edit` | `src/pages/admin/catalogue/AdminBrandEdit.jsx` |
| `/admin/promotions` | `src/pages/admin/promotions/AdminPromotionList.jsx` |
| `/admin/promotions/new` | `src/pages/admin/promotions/AdminPromotionNew.jsx` |
| `/admin/promotions/:promoId/edit` | `src/pages/admin/promotions/AdminPromotionEdit.jsx` |
| `/admin/returns` | `src/pages/admin/returns/AdminReturnList.jsx` |
| `/admin/returns/:returnRequestId` | `src/pages/admin/returns/AdminReturnDetail.jsx` |
| `/admin/users` | `src/pages/admin/users/AdminUserList.jsx` |
| `/admin/users/:userId` | `src/pages/admin/users/AdminUserDetail.jsx` |

---

## Project Structure

```
src/
  assets/          Static images and icons
  components/      Reusable UI and feature components
  config/          Tailwind token extensions and env helpers
  context/         React context providers (Auth, Cart, Notifications)
  hooks/           Custom React hooks
  pages/           Route-level page components
  services/        Axios-based API service modules
  types/           JSDoc type definitions
  utils/           Pure utility functions
  main.jsx         App entry point
```

---

## Docker

A `Dockerfile` and `docker-compose.yml` are provided at the project root for containerised development and deployment. See those files for details.
