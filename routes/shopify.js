const express = require('express');
const router = express.Router();

const ShopifyController = require('../controllers/shopify');

router.get('/', ShopifyController.connect );

router.get('/callback', ShopifyController.callback );

module.exports = router;