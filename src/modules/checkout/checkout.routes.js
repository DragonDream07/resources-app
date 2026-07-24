const express = require('express');
const router = express.Router();
const checkoutController = require('./checkout.controller');
const { validateCheckoutStart, validateCheckoutAddress, validateCheckoutPlaceOrder } = require('./checkout.validator');
const { authenticate, optionalAuthenticate } = require('../../middleware/auth.middleware');

// POST /checkout/start — initiate checkout session (supports guest checkout)
router.post('/start', optionalAuthenticate, validateCheckoutStart, checkoutController.startCheckout);

// POST /checkout/address — save/update shipping address for current checkout
router.post('/address', optionalAuthenticate, validateCheckoutAddress, checkoutController.saveAddress);

// GET /checkout/review — retrieve checkout summary before placing order
router.get('/review', optionalAuthenticate, checkoutController.reviewCheckout);

// POST /checkout/place-order — finalise and place the order
router.post('/place-order', optionalAuthenticate, validateCheckoutPlaceOrder, checkoutController.placeOrder);

module.exports = router;
