const express = require('express');
const router = express.Router();

const ShopifyController = require('../controllers/shopify');
/**
 * Shopify Setup
 */
router.get('/', ShopifyController.connect );
/**
 * Shopify callback
 */
router.get('/callback', ShopifyController.callback );

module.exports = router;