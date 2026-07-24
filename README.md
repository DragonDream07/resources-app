# E-Commerce Backend

A RESTful API for a full-featured e-commerce platform built with **Express**, **Knex**, and **PostgreSQL**.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Variables](#environment-variables)
4. [Database Migrations](#database-migrations)
5. [Seeding](#seeding)
6. [Running Tests](#running-tests)
7. [Module Dependency Direction (ADR)](#module-dependency-direction-adr)
8. [API Overview](#api-overview)

---

## Prerequisites

| Tool | Minimum version |
|------|-----------------|
| Node.js | 18.x |
| npm | 9.x |
| PostgreSQL | 14.x |
| Elasticsearch | 8.x |

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd ecommerce-backend

# 2. Install dependencies
npm install

# 3. Copy and fill in environment variables
cp .env.example .env
# Edit .env with your values

# 4. Run database migrations
npm run migrate

# 5. Seed initial data (roles, admin user, categories, brands, products)
npm run seed

# 6. Start the development server
npm run dev
```

The API will be available at `http://localhost:3000` (or the `PORT` you configured).

---

## Environment Variables

Copy `.env.example` to `.env` and provide values for every variable.

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Runtime environment (`development`, `test`, `production`) | `development` |
| `PORT` | Express listen port | `3000` |
| `DB_HOST` | PostgreSQL host | `127.0.0.1` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name (dev) | `ecommerce_dev` |
| `DB_NAME_TEST` | Database name (test) | `ecommerce_test` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | — |
| `JWT_SECRET` | Secret for access-token signing | — |
| `JWT_EXPIRES_IN` | Access-token TTL | `1h` |
| `JWT_REFRESH_SECRET` | Secret for refresh-token signing | — |
| `JWT_REFRESH_EXPIRES_IN` | Refresh-token TTL | `7d` |
| `BCRYPT_SALT_ROUNDS` | Bcrypt work factor | `12` |
| `ELASTICSEARCH_URL` | Elasticsearch cluster URL | `http://localhost:9200` |
| `ELASTICSEARCH_INDEX` | Index name for product search | `products` |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in ms | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window per IP | `100` |
| `LOG_LEVEL` | Winston log level | `info` |
| `LOG_DIR` | Directory for log files | `logs` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:3001` |

---

## Database Migrations

Migrations live in `src/db/migrations/` and are executed in numeric order.

```bash
# Run all pending migrations
npm run migrate

# Roll back the most recent migration batch
npm run migrate:rollback

# Roll back ALL migrations
knex migrate:rollback --all

# Create a new migration file
npm run migrate:make -- <migration_name>

# Full reset: rollback all, re-migrate, re-seed
npm run db:reset
```

### Migration files

| File | Table created |
|---|---|
| `001_create_roles.js` | `roles` |
| `002_create_users.js` | `users` |
| `003_create_user_roles.js` | `user_roles` |
| `004_create_addresses.js` | `addresses` |
| `005_create_serviceable_pin_codes.js` | `serviceable_pin_codes` |
| `006_create_categories.js` | `categories` |
| `007_create_brands.js` | `brands` |
| `008_create_products.js` | `products` |
| `009_create_product_images.js` | `product_images` |
| `010_create_skus.js` | `skus` |
| `011_create_promo_codes.js` | `promo_codes` |
| `012_create_carts.js` | `carts` |
| `013_create_cart_items.js` | `cart_items` |
| `014_create_orders.js` | `orders` |
| `015_create_order_items.js` | `order_items` |
| `016_create_order_status_history.js` | `order_status_history` |
| `017_create_stock_reservations.js` | `stock_reservations` |
| `018_create_payment_attempts.js` | `payment_attempts` |
| `019_create_refunds.js` | `refunds` |
| `020_create_return_requests.js` | `return_requests` |
| `021_create_order_tracking.js` | `order_tracking` |
| `022_create_notifications.js` | `notifications` |

---

## Seeding

```bash
# Run all seed files in order
npm run seed
```

Seed files in `src/db/seeds/`:

| File | Data |
|---|---|
| `01_roles.js` | Default roles (admin, customer, guest) |
| `02_admin_user.js` | Initial admin user |
| `03_categories.js` | Sample categories |
| `04_brands.js` | Sample brands |
| `05_products_skus.js` | Sample products and SKUs |
| `06_promo_codes.js` | Sample promo codes |

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

Coverage thresholds (build fails if not met):

| Metric | Threshold |
|---|---|
| Branches | 70 % |
| Functions | 75 % |
| Lines | 75 % |
| Statements | 75 % |

---

## Module Dependency Direction (ADR)

### Decision

All inter-layer dependencies must flow in **one direction only**:

```
HTTP layer (routes)
    └─> Controller
          └─> Service
                └─> Repository
                      └─> db/client (Knex)
```

### Rationale

- **Prevents circular imports** — ESLint's `import/no-cycle` rule enforces this at lint time.
- **Enables isolated unit testing** — each layer can be tested by mocking only the layer directly below it.
- **Enforces separation of concerns** — HTTP parsing stays in controllers, business logic stays in services, and SQL stays in repositories.

### Rules

1. Repositories **must not** import from the `src/modules` layer.
2. `src/db/client.js` **must not** import from `src/modules`.
3. `src/middleware` **must not** import from `src/modules`; it may import from `src/config` and `src/utils`.
4. Cross-module imports (e.g., the orders service needing inventory data) must go through the target module's service, never directly into its repository.
5. Shared utilities (`src/utils`, `src/config`) may be imported by any layer.

These rules are codified in `.eslintrc.js` via `import/no-cycle` and `import/no-restricted-paths`.

---

## API Overview

All endpoints are prefixed with `/api/v1` (configured in `src/app.js`).

### Auth
`POST /auth/register` · `POST /auth/login` · `POST /auth/guest-register` · `POST /auth/forgot-password` · `POST /auth/reset-password`

### Users
`GET /users/me` · `PATCH /users/me` · `POST /users/me/change-password`

### Addresses
`GET /users/me/addresses` · `POST /users/me/addresses` · `GET /users/me/addresses/{addressId}` · `PUT /users/me/addresses/{addressId}` · `DELETE /users/me/addresses/{addressId}`

### Catalogue
`GET /products` · `GET /products/{productId}` · `GET /products/{productId}/skus` · `GET /products/{productId}/images` · `GET /categories` · `GET /categories/{categoryId}` · `GET /categories/{categoryId}/products` · `GET /brands` · `GET /brands/{brandId}`

### Search
`GET /search` · `GET /search/suggest`

### Cart
`GET /carts/{cartId}` · `POST /carts/{cartId}/items` · `PATCH /carts/{cartId}/items/{itemId}` · `DELETE /carts/{cartId}/items/{itemId}` · `POST /carts/{cartId}/promo`

### Checkout
`GET /checkout/review` · `POST /checkout/address` · `GET /serviceability` · `POST /checkout/place-order`

### Payments
`POST /payments/initiate`

### Orders
`GET /orders` · `GET /orders/{orderId}` · `GET /orders/{orderId}/timeline` · `GET /orders/{orderId}/tracking` · `GET /orders/{orderId}/refunds` · `POST /orders/{orderId}/cancel` · `POST /orders/{orderId}/advance` · `POST /orders/{orderId}/return-requests`

### Returns
`GET /return-requests` · `GET /return-requests/{returnRequestId}` · `POST /return-requests/{returnRequestId}/review`

### Notifications
`GET /notifications` · `POST /notifications/read-all` · `POST /notifications/{notificationId}/read`

### Admin
`GET /admin/reports` · `POST /products` · `PUT /products/{productId}` · `DELETE /products/{productId}` · `POST /products/{productId}/images` · `POST /products/{productId}/skus` · `PUT /products/{productId}/skus/{skuId}` · `POST /categories` · `PUT /categories/{categoryId}` · `DELETE /categories/{categoryId}` · `POST /brands` · `GET /promo-codes`
