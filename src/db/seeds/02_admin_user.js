'use strict';

const bcrypt = require('bcrypt');

/**
 * Seed default admin user for development
 */
exports.seed = async function (knex) {
  const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000010';
  const ADMIN_ROLE_ID = '00000000-0000-0000-0000-000000000003';

  await knex('user_roles').where({ user_id: ADMIN_USER_ID }).del();
  await knex('users').where({ id: ADMIN_USER_ID }).del();

  const passwordHash = await bcrypt.hash('Admin@1234', 10);

  await knex('users').insert([
    {
      id: ADMIN_USER_ID,
      email: 'admin@example.com',
      password_hash: passwordHash,
      first_name: 'Super',
      last_name: 'Admin',
      phone: '9999999999',
      is_guest: false,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  await knex('user_roles').insert([
    {
      id: '00000000-0000-0000-0000-000000000020',
      user_id: ADMIN_USER_ID,
      role_id: ADMIN_ROLE_ID,
      created_at: knex.fn.now(),
    },
  ]);
};
