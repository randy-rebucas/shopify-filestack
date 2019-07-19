exports.getProducts = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-04/products.json', function(err, data, headers) {
        if (err) {
            res.sendStatus(500).json(err)
        }
        //res.json(data);
        res.render('products', {
            title: 'Products',
            products: data.products
        });
    });
}

exports.createForm = (req, res, next) => {
    req.shopifyToken.get('/admin/themes/' + req.themeId + '/assets.json?asset[key]=config/filestack_data.json', function(err, data, headers) {
        if (err) {
            res.sendStatus(500).json(err)
        }
        var apiKey = null;
        if (Object.keys(data).length) {
            // Object is empty (Would return true in this example)
            var config = JSON.parse(data.asset.value);
            var apiKey = config.key;
        }

        res.render('products-create', {
            title: 'Create Products',
            urlHost: req.get('host'),
            urlProtocol: req.protocol,
            filestackApi: apiKey
        });
    });
}

exports.createProduct = (req, res, next) => {
    /**
     * P,L,S         {aspects}
     * 30X20         {size}
     * NA,BL,WH      {frame}
     * FI,WB         {border}
     *
     * Sample SKU
     * P-30X20-NA-FI
     * {aspects}-{size}-{frame}-{border}
     */
    var productDescription = req.body.productDescription;
    var productPrice = req.body.productPrice;
    var productImageUrl = req.body.variantImageUrl;

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
            "title": 'Online Print and Frame', //variantFormat,
            "body_html": productDescription,
            "vendor": "benmessina", //use active user
            "product_type": "Custom Frame",
            "images": [{
                "src": productImageUrl
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
                "option1": variantSize,
                "option2": variantFrame,
                "option3": variantBorder,
                "price": productPrice,
                "sku": sku
            }]
        }
    }
    req.shopifyToken.post('/admin/api/2019-04/products.json', post_data, function(err, data, headers) {
        if (err) {
            res.sendStatus(500).json(err)
        }
        //res.json(data.product.variants);
        var varients = data.product.variants;
        //iterate all varients
        varients.forEach(function(item) {
            //set varient data to update product varient
            var varient_data = {
                "variant": {
                    "id": data.product.id, //product id
                    "image_id": data.product.image.id //product source image id
                }
            }
            var varId = item.id + '.json';
            req.shopifyToken.put('/admin/api/2019-04/variants/' + varId, varient_data, function(err, data, headers) {
                if (err) {
                    res.sendStatus(500).json(err)
                }
                var orderData = {
                    "order": {
                        "line_items": [{
                            "variant_id": item.id,
                            "quantity": 1
                        }],
                        "note": "Open the link provided below for source image.",
                        "note_attributes": [{
                            "name": "Filestack source",
                            "value": productImageUrl
                        }],
                        "fulfillment_status": null,
                        "financial_status": "pending"
                    }
                }

                req.shopifyToken.post('/admin/api/2019-04/orders.json', orderData, function(err, response, headers) {
                    if (err) {
                        //res.sendStatus(500).json(err)
                        res.sendStatus(err.status || 500);
                        res.render('error');
                    }
                    res.redirect('orders/' + response.order.id);

                });
            });
        });
    });
}

exports.updateProduct = (req, res, next) => {
    var put_data = {
        "product": {
            "body_html": "<strong>Updated!</strong>"
        }
    }

    var prodId = req.params + '.json';

    req.shopifyToken.put('/admin/api/2019-04/products/' + prodId, put_data, function(err, data, headers) {
        console.log(data);
    });
}

exports.deleteProduct = (req, res, next) => {

    var prodId = req.params + '.json';

    req.shopifyToken.delete('/admin/api/2019-04/products/' + prodId, function(err, data, headers) {
        console.log(data);
    });
}