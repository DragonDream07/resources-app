/**
 * Migration: 006_create_categories
 * Creates the categories table with a self-referencing parent_id.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name', 128).notNullable();
    table.string('slug', 128).notNullable().unique();
    table.text('description').nullable();
    table.string('image_url', 512).nullable();
    table
      .integer('parent_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('categories')
      .onDelete('SET NULL');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.integer('sort_order').notNullable().defaultTo(0);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('categories');
};
