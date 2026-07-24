/**
 * Migration: 017_create_stock_reservations
 * Creates the stock_reservations table with FK → skus, orders.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('stock_reservations', (table) => {
    table.increments('id').primary();
    table
      .integer('sku_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('skus')
      .onDelete('CASCADE');
    table
      .integer('order_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('orders')
      .onDelete('SET NULL');
    table.integer('quantity').unsigned().notNullable();
    table.string('status', 32).notNullable().defaultTo('reserved');
    table.timestamp('expires_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.index(['sku_id']);
    table.index(['order_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('stock_reservations');
};
