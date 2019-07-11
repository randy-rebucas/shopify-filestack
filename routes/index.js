const express = require('express');
const router = express.Router();
const shopifyConnection = require('../middleware/shopify-api');

const MetafieldController = require('../controllers/metafields');
/* GET order page. */
router.get('/', shopifyConnection, MetafieldController.getShop);

router.post('/', shopifyConnection, MetafieldController.createShop);

module.exports = router;