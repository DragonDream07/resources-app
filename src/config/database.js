'use strict';

const config = require('./index');

const knexConfig = {
  client: 'pg',
  connection: {
    host: config.db.host,
    port: config.db.port,
    database: config.db.name,
    user: config.db.user,
    password: config.db.password,
  },
  pool: {
    min: config.db.pool.min,
    max: config.db.pool.max,
  },
  migrations: {
    directory: '../db/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: '../db/seeds',
  },
};

module.exports = knexConfig;
