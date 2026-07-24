'use strict';

/**
 * Seed default roles: customer, staff, admin
 */
exports.seed = async function (knex) {
  await knex('roles').del();

  await knex('roles').insert([
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'customer',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'staff',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'admin',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
