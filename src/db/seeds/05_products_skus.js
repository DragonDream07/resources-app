'use strict';

/**
 * Seed sample products and SKU variants
 */
exports.seed = async function (knex) {
  await knex('skus').del();
  await knex('product_images').del();
  await knex('products').del();

  // ------------------------------------------------------------------ products
  await knex('products').insert([
    {
      id: '30000000-0000-0000-0000-000000000001',
      name: 'TechNova Smartphone X1',
      slug: 'technova-smartphone-x1',
      description: 'A flagship smartphone with cutting-edge features.',
      brand_id: '20000000-0000-0000-0000-000000000001',
      category_id: '10000000-0000-0000-0000-000000000011',
      base_price: 29999.00,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '30000000-0000-0000-0000-000000000002',
      name: 'SwiftCompute UltraBook Pro',
      slug: 'swiftcompute-ultrabook-pro',
      description: 'Thin, light, and powerful laptop for professionals.',
      brand_id: '20000000-0000-0000-0000-000000000004',
      category_id: '10000000-0000-0000-0000-000000000012',
      base_price: 74999.00,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '30000000-0000-0000-0000-000000000003',
      name: 'UrbanWear Classic Tee',
      slug: 'urbanwear-classic-tee',
      description: 'Premium cotton classic fit T-shirt.',
      brand_id: '20000000-0000-0000-0000-000000000002',
      category_id: '10000000-0000-0000-0000-000000000021',
      base_price: 599.00,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '30000000-0000-0000-0000-000000000004',
      name: 'HomeEssentials Non-Stick Cookware Set',
      slug: 'homeessentials-nonstick-cookware-set',
      description: '5-piece non-stick cookware set for everyday cooking.',
      brand_id: '20000000-0000-0000-0000-000000000003',
      category_id: '10000000-0000-0000-0000-000000000003',
      base_price: 2499.00,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  // ----------------------------------------------------------------------- skus
  await knex('skus').insert([
    // TechNova Smartphone X1 — storage variants
    {
      id: '40000000-0000-0000-0000-000000000001',
      product_id: '30000000-0000-0000-0000-000000000001',
      sku_code: 'TNX1-64GB',
      attributes: JSON.stringify({ storage: '64GB', color: 'Midnight Black' }),
      price: 29999.00,
      stock_quantity: 50,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      product_id: '30000000-0000-0000-0000-000000000001',
      sku_code: 'TNX1-128GB',
      attributes: JSON.stringify({ storage: '128GB', color: 'Pearl White' }),
      price: 34999.00,
      stock_quantity: 30,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000003',
      product_id: '30000000-0000-0000-0000-000000000001',
      sku_code: 'TNX1-256GB',
      attributes: JSON.stringify({ storage: '256GB', color: 'Midnight Black' }),
      price: 39999.00,
      stock_quantity: 20,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // SwiftCompute UltraBook Pro — RAM/storage variants
    {
      id: '40000000-0000-0000-0000-000000000011',
      product_id: '30000000-0000-0000-0000-000000000002',
      sku_code: 'SCUB-8-256',
      attributes: JSON.stringify({ ram: '8GB', storage: '256GB SSD' }),
      price: 74999.00,
      stock_quantity: 15,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000012',
      product_id: '30000000-0000-0000-0000-000000000002',
      sku_code: 'SCUB-16-512',
      attributes: JSON.stringify({ ram: '16GB', storage: '512GB SSD' }),
      price: 89999.00,
      stock_quantity: 10,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // UrbanWear Classic Tee — size variants
    {
      id: '40000000-0000-0000-0000-000000000021',
      product_id: '30000000-0000-0000-0000-000000000003',
      sku_code: 'UWCT-S',
      attributes: JSON.stringify({ size: 'S', color: 'White' }),
      price: 599.00,
      stock_quantity: 100,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000022',
      product_id: '30000000-0000-0000-0000-000000000003',
      sku_code: 'UWCT-M',
      attributes: JSON.stringify({ size: 'M', color: 'White' }),
      price: 599.00,
      stock_quantity: 150,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000023',
      product_id: '30000000-0000-0000-0000-000000000003',
      sku_code: 'UWCT-L',
      attributes: JSON.stringify({ size: 'L', color: 'White' }),
      price: 599.00,
      stock_quantity: 120,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000024',
      product_id: '30000000-0000-0000-0000-000000000003',
      sku_code: 'UWCT-XL',
      attributes: JSON.stringify({ size: 'XL', color: 'White' }),
      price: 599.00,
      stock_quantity: 80,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // HomeEssentials Cookware Set — single variant
    {
      id: '40000000-0000-0000-0000-000000000031',
      product_id: '30000000-0000-0000-0000-000000000004',
      sku_code: 'HENS-5PC',
      attributes: JSON.stringify({ pieces: '5', color: 'Grey' }),
      price: 2499.00,
      stock_quantity: 40,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
