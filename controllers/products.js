function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

exports.getProducts = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-04/products.json', function(err, data, headers) {
        //res.json(data);
        res.render('products', {
            title: 'Products',
            products: data.products
        });
    });
}

exports.createForm = (req, res, next) => {
    req.shopifyToken.get('/admin/themes/' + req.themeId + '/assets.json?asset[key]=config/filestack_data.json', function(err, data, headers) {
        var apiKey = null;
        if (!isEmpty(data)) {
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

exports.createOrder = (req, res, next) => {

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
            "financial_status": "authorized"
                //"send_receipt": true,
                //"send_fulfillment_receipt": true,
                //"processing_method": "manual",
                //"source_name": "web",
                //"tags": "custom-frames, frames",
                //"gateway": "shopify_payments",
                //"referring_site": req.get('host'),
                //"browser_ip": req.header('x-forwarded-for') || req.connection.remoteAddress,
                //"taxes_included": true
        }
    }
    req.shopifyToken.post('/admin/api/2019-04/orders.json', orderData, function(err, orderdata, headers) {
        try {
            console.log(orderData);
            res.redirect('orders/' + orderdata.order.id);
        } catch (error) {
            res.status(500);
            res.render('error');
        }

    });
}

exports.createProduct = (req, res, next) => {
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
            //"metafields_global_title_tag": variantFormat,
            //"metafields_global_description_tag": productDescription,
            //"tags": "custom-frames, sizes, borders",
            //"published": true,
            //"created_at": new Date().toISOString(),
            //"fulfillment_service": "manual",
            //"requires_shipping": false,
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
            }],
            "metafields": [{
                "key": "filestackId",
                "value": productImageUrl,
                "value_type": "string",
                "namespace": "filestack"
            }]
        }
    }
    req.shopifyToken.post('/admin/api/2019-04/products.json', post_data, function(err, data, headers) {
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
            //update varient image
            req.shopifyToken.put('/admin/api/2019-04/variants/' + varId, varient_data, function(err, data, headers) {
                //set cart redirection base on config store

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
                        "fulfillment_status": null

                        //"send_receipt": true,
                        //"send_fulfillment_receipt": true,
                        //"processing_method": "manual",
                        //"source_name": "web",
                        //"tags": "custom-frames, frames",
                        //"gateway": "shopify_payments",
                        //"referring_site": req.get('host'),
                        //"browser_ip": req.header('x-forwarded-for') || req.connection.remoteAddress,
                        //"taxes_included": true
                    }
                }

                req.shopifyToken.post('/admin/api/2019-04/orders.json', orderData, function(err, response, headers) {
                    res.redirect('orders/' + response.order.id);
                });

                //const redirection = 'http://' + req.shopifyToken.config.shop + '.myshopify.com/cart/add?id='+item.id;
                //res.status(200).redirect(redirection);
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