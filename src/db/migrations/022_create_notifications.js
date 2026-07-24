/**
 * Migration: 022_create_notifications
 * Creates the notifications table with FK → users (nullable for broadcast).
 */
exports.up = async function (knex) {
  await knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('type', 64).notNullable();
    table.string('title', 255).notNullable();
    table.text('body').notNullable();
    table.jsonb('data').nullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table.boolean('is_broadcast').notNullable().defaultTo(false);
    table.timestamp('read_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.index(['user_id']);
    table.index(['is_read']);
    table.index(['is_broadcast']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('notifications');
};
