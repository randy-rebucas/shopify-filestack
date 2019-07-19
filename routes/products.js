const express = require('express');
const router = express.Router();

const shopifyConnection = require('../middleware/shopify-api');
const themesData = require('../middleware/themes');
const filestackData = require('../middleware/filestackApi');

const ProductController = require('../controllers/products');
/**
 *  View product form
 */
router.get('/create', shopifyConnection, themesData, filestackData, ProductController.createForm);
/**
 * Get all products
 */
router.get('/', shopifyConnection, ProductController.getProducts);
/**
 * Get single product
 */
router.get('/:productId', shopifyConnection, ProductController.getProduct);
/**
 * Create new Product and Order
 */
router.post('/', shopifyConnection, ProductController.createProduct);


module.exports = router;