const express = require('express');
const router = express.Router();

const shopifyConnection = require('../middleware/shopify-api');
const themesData = require('../middleware/themes');

const AssestController = require('../controllers/assets');
/**
 *  GET Filestack Assets
 */
router.get('/', shopifyConnection, themesData, AssestController.getFilestackAssets);

/**
 * Create Filestack Configuration Assets
 */
router.post('/', shopifyConnection, themesData, AssestController.createFilestackConfigAssets);

module.exports = router;