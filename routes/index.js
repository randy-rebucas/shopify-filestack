const express = require('express');
const router = express.Router();
const shopifyConnection = require('../middleware/shopify-api');
const themesData = require('../middleware/themes');

const MetafieldController = require('../controllers/metafields');
/* GET order page. */
router.get('/', shopifyConnection, themesData, MetafieldController.getShop);

router.post('/', shopifyConnection, themesData, MetafieldController.createShop);

module.exports = router;