const express = require('express');
const router = express.Router();

const shopifyConnection = require('../middleware/shopify-api');

const SuccessController = require('../controllers/success');
/* GET success page. */
router.get('/', shopifyConnection, SuccessController.getSuccess);

module.exports = router;