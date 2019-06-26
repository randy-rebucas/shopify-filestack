const express = require('express');
const router = express.Router();
//const client = require('filestack-js').init('AyttY1npLTImAmrYGmYOpz');
const shopifyAPI = require('shopify-node-api');

var Shopify = new shopifyAPI({
    shop: 'benmessina', // MYSHOP.myshopify.com
    shopify_api_key: '664220ffb95667516895f191a11b9820', // Your API key
    access_token: 'e9e59dadee510d8bcec1837712c3786b' // Your API password
});

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('products', { title: 'Products' });

    /*Shopify.get('/admin/products.json', function(err, data, headers){
        res.json(data);
	  });*/
});

router.post('/', function(req, res, next) {
    var post_data = {
        "product": {
            "title": req.body.format,
            "body_html": "<strong>Good snowboard!</strong>",
            "vendor": "benmessina", //use active user
            "product_type": "Custom Frame",
            "metafields_global_title_tag": "Brand new " + req.body.format,
            "metafields_global_description_tag": "Brand new " + req.body.format,
            "tags": "custom-frames, sizes, borders",
            "published": true,
            "created_at": new Date().toISOString(),
            "fulfillment_service": "manual",
            "requires_shipping": false,
            "images": [{
                "src": req.body.image // frame aspects
            }],
            "options": [{
                    "position": 1,
                    "name": "Size"
                },
                {
                    "position": 2,
                    "name": "Frame"
                },
                {
                    "position": 3,
                    "name": "Border"
                }
            ],
            "variants": [{
                //"image_id": req.body.image,          //filestack image id
                "option1": req.body.size, // string
                "option2": req.body.frame, // string
                "option3": req.body.border, // string
                "price": "10.00", // generate price depend on selection
                "sku": "1234" // generate uniqe sku
            }]
        }
    }
    Shopify.post('/admin/products.json', post_data, function(err, data, headers) {
        //res.json(data);
        res.status(200).redirect('/products');
    });
});

router.put('/', function(req, res, next) {
    var put_data = {
        "product": {
            "body_html": "<strong>Updated!</strong>"
        }
    }

    Shopify.put('/admin/products/1234567.json', put_data, function(err, data, headers) {
        console.log(data);
    });

});

router.delete('/', function(req, res, next) {
    Shopify.delete('/admin/products/1234567.json', function(err, data, headers) {
        console.log(data);
    });
});

module.exports = router;