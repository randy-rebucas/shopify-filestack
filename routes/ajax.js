const express = require('express');
const router = express.Router();

const shopifyConnection = require('../middleware/shopify-api');

const sotreController = require('../common/store');
/**
 *  GET Countries
 */
router.get('/countries', shopifyConnection, sotreController.countries);

/**
 *  GET Provinces
 */
router.get('/provinces/:countryId', shopifyConnection, sotreController.provinces);

module.exports = router;