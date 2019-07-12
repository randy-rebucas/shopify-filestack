const express = require('express');
const router = express.Router();

const shopifyConnection = require('../middleware/shopify-api');

const ProductController = require('../controllers/products');
/* GET home page. */

router.get('/create', shopifyConnection, function(req, res, next) {
    req.shopifyToken.get('/admin/api/2019-04/metafields.json', function(err, data, headers) {
        res.render('products-create', {
            title: 'Create Products',
            urlHost: req.get('host'),
            urlProtocol: req.protocol,
            metafield: data.metafields
        });
    });
});

router.get('/', shopifyConnection, ProductController.getProducts);

router.post('/', shopifyConnection, ProductController.createProduct);

router.put('/:productId', shopifyConnection, ProductController.updateProduct);

router.delete('/:productId', shopifyConnection, ProductController.deleteProduct);

module.exports = router;