/**
 * Migration: 010_create_skus
 * Creates the skus table with FK → products and size/colour/stock columns.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('skus', (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
    table.string('sku_code', 128).notNullable().unique();
    table.string('size', 64).nullable();
    table.string('colour', 64).nullable();
    table.integer('stock').unsigned().notNullable().defaultTo(0);
    table.integer('reserved_stock').unsigned().notNullable().defaultTo(0);
    table.decimal('additional_price', 12, 2).notNullable().defaultTo(0);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('skus');
};
