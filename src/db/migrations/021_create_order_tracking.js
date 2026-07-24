/**
 * Migration: 021_create_order_tracking
 * Creates the order_tracking table with FK → orders.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('order_tracking', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('courier_name', 128).nullable();
    table.string('tracking_number', 128).nullable();
    table.string('tracking_url', 512).nullable();
    table.string('current_status', 64).nullable();
    table.string('current_location', 255).nullable();
    table.jsonb('tracking_events').nullable();
    table.timestamp('estimated_delivery_at').nullable();
    table.timestamp('delivered_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.index(['order_id']);
    table.index(['tracking_number']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('order_tracking');
};
