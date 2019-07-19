const express = require('express');
const router = express.Router();
const shopifyConnection = require('../middleware/shopify-api');

const OrderController = require('../controllers/orders');
/**
 *  GET all orders. 
 */
router.get('/', shopifyConnection, OrderController.getOrders);
/**
 * Get single order
 */
router.get('/:orderId', shopifyConnection, OrderController.getOrder);
/**
 * Create new order
 */
router.post('/', shopifyConnection, OrderController.updateOrder);

module.exports = router;