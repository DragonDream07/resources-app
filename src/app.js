'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const rolesRoutes = require('./modules/roles/roles.routes');
const addressesRoutes = require('./modules/addresses/addresses.routes');
const catalogueRoutes = require('./modules/catalogue/catalogue.routes');
const searchRoutes = require('./modules/search/search.routes');
const cartRoutes = require('./modules/cart/cart.routes');
const promotionsRoutes = require('./modules/promotions/promotions.routes');
const checkoutRoutes = require('./modules/checkout/checkout.routes');
const paymentsRoutes = require('./modules/payments/payments.routes');
const ordersRoutes = require('./modules/orders/orders.routes');
const returnsRoutes = require('./modules/returns/returns.routes');
const notificationsRoutes = require('./modules/notifications/notifications.routes');
const adminRoutes = require('./modules/admin/admin.routes');

function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());
  app.use(compression());

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use(requestLogger);

  // Rate limiting
  app.use(rateLimiter);

  // Mount module routers
  app.use('/auth', authRoutes);
  app.use('/users', usersRoutes);
  app.use('/roles', rolesRoutes);
  app.use('/users', addressesRoutes);
  app.use('/', catalogueRoutes);
  app.use('/search', searchRoutes);
  app.use('/carts', cartRoutes);
  app.use('/', promotionsRoutes);
  app.use('/checkout', checkoutRoutes);
  app.use('/payments', paymentsRoutes);
  app.use('/orders', ordersRoutes);
  app.use('/', returnsRoutes);
  app.use('/notifications', notificationsRoutes);
  app.use('/admin', adminRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
