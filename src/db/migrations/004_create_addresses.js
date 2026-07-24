/**
 * Migration: 004_create_addresses
 * Creates the addresses table with FK → users.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('addresses', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('full_name', 255).notNullable();
    table.string('phone', 32).notNullable();
    table.string('line1', 255).notNullable();
    table.string('line2', 255).nullable();
    table.string('city', 128).notNullable();
    table.string('state', 128).notNullable();
    table.string('pin_code', 16).notNullable();
    table.string('country', 64).notNullable().defaultTo('India');
    table.boolean('is_default').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('addresses');
};
