'use strict';

/**
 * Seed sample promo codes
 */
exports.seed = async function (knex) {
  await knex('promo_codes').del();

  await knex('promo_codes').insert([
    {
      id: '50000000-0000-0000-0000-000000000001',
      code: 'WELCOME10',
      description: '10% off for new customers',
      discount_type: 'percentage',
      discount_value: 10.00,
      min_order_value: 500.00,
      max_discount_amount: 500.00,
      usage_limit: 1000,
      usage_count: 0,
      is_active: true,
      valid_from: '2024-01-01 00:00:00',
      valid_until: '2099-12-31 23:59:59',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '50000000-0000-0000-0000-000000000002',
      code: 'FLAT200',
      description: 'Flat Rs. 200 off on orders above Rs. 1500',
      discount_type: 'flat',
      discount_value: 200.00,
      min_order_value: 1500.00,
      max_discount_amount: 200.00,
      usage_limit: 500,
      usage_count: 0,
      is_active: true,
      valid_from: '2024-01-01 00:00:00',
      valid_until: '2099-12-31 23:59:59',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '50000000-0000-0000-0000-000000000003',
      code: 'TECH15',
      description: '15% off on electronics (max Rs. 2000)',
      discount_type: 'percentage',
      discount_value: 15.00,
      min_order_value: 5000.00,
      max_discount_amount: 2000.00,
      usage_limit: 200,
      usage_count: 0,
      is_active: true,
      valid_from: '2024-01-01 00:00:00',
      valid_until: '2099-12-31 23:59:59',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '50000000-0000-0000-0000-000000000004',
      code: 'EXPIRED50',
      description: 'Expired promo — 50% off (testing purposes)',
      discount_type: 'percentage',
      discount_value: 50.00,
      min_order_value: 0.00,
      max_discount_amount: 1000.00,
      usage_limit: 100,
      usage_count: 100,
      is_active: false,
      valid_from: '2020-01-01 00:00:00',
      valid_until: '2020-12-31 23:59:59',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
