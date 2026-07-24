/**
 * Migration: 020_create_return_requests
 * Creates the return_requests table with FK → orders.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('return_requests', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('status', 64).notNullable().defaultTo('pending');
    table.text('reason').notNullable();
    table.text('customer_note').nullable();
    table.text('admin_note').nullable();
    table.jsonb('items').nullable();
    table
      .integer('reviewed_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamp('reviewed_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.index(['order_id']);
    table.index(['status']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('return_requests');
};
