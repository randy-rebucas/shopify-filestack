const express = require('express');
const router = express.Router();

const shopifyConnection = require('../middleware/shopify-api');

const ProductController = require('../controllers/products');
/* GET home page. */

router.get('/create', function(req, res, next) {
    res.render('products-create', { 
        title: 'Create Products', 
        urlHost: req.get('host'), 
        urlProtocol: req.protocol 
    });
});

router.get('/', shopifyConnection, ProductController.getProducts );

router.post('/', shopifyConnection, ProductController.createProduct );

router.put('/:productId', shopifyConnection, ProductController.updateProduct );

router.delete('/:productId', shopifyConnection, ProductController.deleteProduct );

module.exports = router;