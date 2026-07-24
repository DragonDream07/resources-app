/**
 * Migration: 018_create_payment_attempts
 * Creates the payment_attempts table with FK → orders.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('payment_attempts', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('payment_gateway', 64).notNullable();
    table.string('gateway_order_id', 255).nullable();
    table.string('gateway_payment_id', 255).nullable();
    table.string('gateway_signature', 512).nullable();
    table.decimal('amount', 12, 2).notNullable();
    table.string('currency', 8).notNullable().defaultTo('INR');
    table.string('status', 64).notNullable().defaultTo('initiated');
    table.jsonb('raw_response').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.index(['order_id']);
    table.index(['gateway_payment_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('payment_attempts');
};
