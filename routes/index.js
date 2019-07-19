const express = require('express');
const router = express.Router();
const shopifyConnection = require('../middleware/shopify-api');
const themesData = require('../middleware/themes');

const MetafieldController = require('../controllers/metafields');
const ThemeController = require('../controllers/themes');
/* GET order page. */
router.get('/', shopifyConnection, themesData, MetafieldController.getShop);

router.post('/', shopifyConnection, themesData, ThemeController.createConfig);

module.exports = router;