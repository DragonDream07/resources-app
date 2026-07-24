const db = require('../client');

const TABLE = 'serviceable_pin_codes';

async function findByPinCode(pin_code) {
  return db(TABLE).where({ pin_code }).first();
}

async function isServiceable(pin_code) {
  const row = await findByPinCode(pin_code);
  return row ? row.is_active === true || row.is_active === 1 : false;
}

async function list({ limit = 100, offset = 0 } = {}) {
  return db(TABLE).limit(limit).offset(offset);
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return db(TABLE).where({ id }).first();
}

async function updateByPinCode(pin_code, data) {
  await db(TABLE).where({ pin_code }).update(data);
  return findByPinCode(pin_code);
}

async function deleteByPinCode(pin_code) {
  return db(TABLE).where({ pin_code }).delete();
}

module.exports = {
  findByPinCode,
  isServiceable,
  list,
  create,
  updateByPinCode,
  deleteByPinCode,
};
