exports.getProducts = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-04/products.json', function(err, data, headers) {
        if (err) {
            res.sendStatus(500).json(err)
        }
        res.render('products', {
            title: 'Products',
            products: data.products
        });
    });
}

exports.getProduct = (req, res, next) => {
    var productJasonFile = req.params.productId + '.json';
    req.shopifyToken.get(encodeURI('/admin/api/2019-07/products/' + productJasonFile), function(err, productData, headers) {
        if (err) {
            res.sendStatus(err.status || 500);
            res.render('error');
        }
        res.render('product-detail', {
            title: 'Product',
            data: productData
        });
    });
}

exports.createForm = (req, res, next) => {
    res.render('products-create', {
        title: 'Create Products',
        urlHost: req.get('host'),
        urlProtocol: req.protocol,
        filestackApi: req.filestackApi
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
            "title": 'Online Print and Frame',
            "body_html": productDescription,
            "vendor": "benmessina",
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
                    res.sendStatus(err.status || 500);
                    res.render('error');
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
                        res.sendStatus(err.status || 500);
                        res.render('error');
                    }
                    res.redirect('orders/' + response.order.id);

                });
            });
        });
    });
}
