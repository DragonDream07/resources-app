const express = require('express');
const router = express.Router();
const addressesController = require('./addresses.controller');
const addressesValidator = require('./addresses.validator');
const { authenticate } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');

router.use(authenticate);

router.get('/', addressesController.getAddresses);
router.get('/:addressId', addressesController.getAddressById);
router.post('/', validate(addressesValidator.createAddress), addressesController.createAddress);
router.put('/:addressId', validate(addressesValidator.updateAddress), addressesController.updateAddress);
router.delete('/:addressId', addressesController.deleteAddress);

module.exports = router;
