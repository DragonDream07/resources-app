/**
 * Migration: 011_create_promo_codes
 * Creates the promo_codes table with a rules JSON column.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('promo_codes', (table) => {
    table.increments('id').primary();
    table.string('code', 64).notNullable().unique();
    table.string('discount_type', 32).notNullable();
    table.decimal('discount_value', 12, 2).notNullable();
    table.decimal('min_order_value', 12, 2).nullable();
    table.decimal('max_discount_amount', 12, 2).nullable();
    table.integer('usage_limit').unsigned().nullable();
    table.integer('usage_count').unsigned().notNullable().defaultTo(0);
    table.integer('per_user_limit').unsigned().nullable();
    table.timestamp('valid_from').notNullable();
    table.timestamp('valid_until').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.jsonb('rules').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('promo_codes');
};
