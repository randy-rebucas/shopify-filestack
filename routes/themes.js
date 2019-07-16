const express = require('express');
const router = express.Router();
const shopifyConnection = require('../middleware/shopify-api');
const themesData = require('../middleware/themes');

const ThemesController = require('../controllers/themes');
/* GET order page. */
router.get('/', shopifyConnection, ThemesController.getTheme);

router.get('/create', shopifyConnection, ThemesController.createSnippet);

router.get('/assets', shopifyConnection, ThemesController.getThemeAssets);

router.get('/config', shopifyConnection, themesData, ThemesController.createConfig);

router.get('/download/:file(*)', ThemesController.downloadFile);

module.exports = router;