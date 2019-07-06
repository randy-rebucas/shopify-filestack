exports.getProducts = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-04/products.json', function(err, data, headers){
        //res.json(data);
        res.render('products', { 
            title: 'Products',
            products: data.products
        });
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
    req.shopifyToken.post('/admin/api/2019-04/products.json', post_data, function(err, data, headers) {

        var varients = data.product.variants;
        varients.forEach(function(item){
            const redirection = 'http://' + req.shopifyToken.config.shop + '.myshopify.com/cart/add?id='+item.id;
            res.status(200).redirect(redirection);
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

    req.shopifyToken.put('/admin/api/2019-04/products/'+ prodId, put_data, function(err, data, headers) {
        console.log(data);
    });
}

exports.deleteProduct = (req, res, next) => {

    var prodId = req.params + '.json';

    req.shopifyToken.delete('/admin/api/2019-04/products/' + prodId, function(err, data, headers) {
        console.log(data);
    });
}