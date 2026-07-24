const usersService = require('./users.service');

const getMe = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const user = await usersService.updateUser(req.user.id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await usersService.changePassword(req.user.id, req.body);
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

const getMyAddresses = async (req, res, next) => {
  try {
    const addresses = await usersService.getAddressesByUserId(req.user.id);
    res.json({ success: true, data: addresses });
  } catch (err) {
    next(err);
  }
};

const createMyAddress = async (req, res, next) => {
  try {
    const address = await usersService.createAddress(req.user.id, req.body);
    res.status(201).json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const getMyAddress = async (req, res, next) => {
  try {
    const address = await usersService.getAddressById(req.user.id, req.params.addressId);
    res.json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const updateMyAddress = async (req, res, next) => {
  try {
    const address = await usersService.updateAddress(req.user.id, req.params.addressId, req.body);
    res.json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const deleteMyAddress = async (req, res, next) => {
  try {
    await usersService.deleteAddress(req.user.id, req.params.addressId);
    res.json({ success: true, message: 'Address deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const result = await usersService.getUsers({ page: parseInt(page), limit: parseInt(limit), search, role });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await usersService.updateUser(req.params.userId, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await usersService.deleteUser(req.params.userId);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateMe,
  changePassword,
  getMyAddresses,
  createMyAddress,
  getMyAddress,
  updateMyAddress,
  deleteMyAddress,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
