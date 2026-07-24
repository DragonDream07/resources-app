const authService = require('./auth.service');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : null;
    await authService.logout(token);
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    await authService.forgotPassword(req.body);
    return res.status(200).json({ message: 'If that email is registered, a password reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body);
    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    next(err);
  }
}

async function guestRegister(req, res, next) {
  try {
    const result = await authService.guestRegister(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  guestRegister,
};
