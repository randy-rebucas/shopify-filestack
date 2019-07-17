const express = require('express');
const router = express.Router();
const shopifyConnection = require('../middleware/shopify-api');

const OrderController = require('../controllers/orders');
/* GET order page. */

router.get('/', shopifyConnection, OrderController.getOrders);

router.get('/:orderId', shopifyConnection, OrderController.getOrder);

router.post('/', shopifyConnection, OrderController.updateOrder);

module.exports = router;