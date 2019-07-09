const express = require('express');
const router = express.Router();
const shopifyConnection = require('../middleware/shopify-api');

const OrderController = require('../controllers/orders');
/* GET order page. */
/*var Handlebars     = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');
HandlebarsIntl.registerWith(Handlebars);*/
var hbs = require('handlebars');
hbs.registerHelper('hbs-intl', require('handlebars-intl'));

router.get('/', shopifyConnection, OrderController.getOrders );

router.get('/:orderId', shopifyConnection, OrderController.getOrder );

module.exports = router;