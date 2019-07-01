const express = require('express');
const router = express.Router();
//const client = require('filestack-js').init('AyttY1npLTImAmrYGmYOpz');
const shopifyAPI = require('shopify-node-api');

//var hbs = require('hbs');
//hbs.registerPartials(__dirname + '../views/partials');
var hbs = require('hbs');
var fs = require('fs');

var partialsDir = __dirname + '/../views/partials';

var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

var Shopify = new shopifyAPI({
    shop: 'benmessina', // MYSHOP.myshopify.com
    shopify_api_key: '13cd2e9b77be61944e72517e2bd9cf99', // Your API key
    access_token: '480cd45438165a9b962b96db2c9e37ea' // Your API password
});

/* GET home page. */
router.get('/', function(req, res, next) {
    Shopify.get('/admin/products.json', function(err, data, headers){
        //res.json(data);
        res.render('products', { 
            title: 'Products',
            products: data.products
        });
	});
});

router.get('/create', function(req, res, next) {
    res.render('products-create', { title: 'Create Products' });
});

router.post('/', function(req, res, next) {
    //P,L,S         {aspects}
    //30X20         {size}
    //NA,BL,WH      {frame}
    //FI,WB         {border}
    /**
     * Sample SKU
     * P-30X20-NA-FI
     * {aspects}-{size}-{frame}-{border}
     */
    var productDescription = req.body.productDescription;
    var productPrice = req.body.productPrice;
    var productImage = req.body.variantImage;

    var variantFormat = req.body.variantFormat;
    var variantSize = req.body.variantSize;
    var variantFrame = req.body.variantFrame;
    var variantBorder = req.body.variantBorder;

    var aspect = variantFormat.charAt(0).toUpperCase();
    var size = variantSize.toUpperCase()
    var frame = variantFrame.substring(0, 2).toUpperCase();
    var border = variantBorder.substring(0, 2).toUpperCase();
    var elem = [aspect, size, frame, border];
    var sku = elem.join('-');

    var post_data = {
        "product": {
            "title": 'Online Print and Frame',//variantFormat,
            "body_html": productDescription,
            "vendor": "benmessina", //use active user
            "product_type": "Custom Frame",
            "metafields_global_title_tag": variantFormat,
            "metafields_global_description_tag": productDescription,
            "tags": "custom-frames, sizes, borders",
            "published": true,
            //"created_at": new Date().toISOString(),
            "fulfillment_service": "manual",
            "requires_shipping": false,
            "images": [{
                "src": productImage
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
                "option1": variantSize, 
                "option2": variantFrame, 
                "option3": variantBorder, 
                "price": productPrice, 
                "sku": sku 
            }]
        }
    }
    Shopify.post('/admin/products.json', post_data, function(err, data, headers) {

        var varients = data.product.variants;
        varients.forEach(function(item){
            res.status(200).redirect('http://benmessina.myshopify.com/cart/add?id='+item.id);
        });

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