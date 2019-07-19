const express = require('express');
const router = express.Router();
const shopifyConnection = require('../middleware/shopify-api');
const themesData = require('../middleware/themes');

const ThemesController = require('../controllers/themes');
const ShareableCommon = require('../common/shareable');

/**
 *  Get themes
 */
router.get('/', shopifyConnection, themesData, ThemesController.getTheme);
/**
 *  Download
 */
router.get('/download/:file(*)', ShareableCommon.downloadFile);

module.exports = router;