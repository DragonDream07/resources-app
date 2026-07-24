/**
 * Migration: 002_create_users
 * Creates the users table with a bcrypt password_hash column.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('first_name', 128).notNullable();
    table.string('last_name', 128).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('phone', 32).nullable();
    table.string('password_hash', 255).notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.boolean('is_guest').notNullable().defaultTo(false);
    table.string('password_reset_token', 255).nullable();
    table.timestamp('password_reset_expires_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('users');
};
