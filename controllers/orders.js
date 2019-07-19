exports.getOrders = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-04/orders.json', function(err, data, headers) {
        if (err) {
            //res.sendStatus(500).json(err)
            res.sendStatus(err.status || 500);
            res.render('error');
        }
        res.render('orders', {
            title: 'Orders',
            orders: data.orders
        });
    });
}

exports.getOrder = (req, res, next) => {
    var orderJasonFile = req.params.orderId + '.json';
    req.shopifyToken.get(encodeURI('/admin/api/2019-07/orders/' + orderJasonFile), function(err, orderData, headers) {
        if (err) {
            //res.sendStatus(500).json(err)
            res.sendStatus(err.status || 500);
            res.render('error');
        }

        /*req.shopifyToken.get('/admin/api/2019-07/products/'+orderData.order.line_items.product_id+'/images.json', function(err, imageData, headers) {
            imageData.forEach(function(key, index, originalObject) {
                var val = o[key];
            });
        });
        console.log(orderData.order.line_items);*/
        pageTitle = 'Order ' + orderData.order.name;

        res.render('order-detail', {
            title: 'Order',
            page_title: pageTitle,
            data: orderData
        });
        
    });
}

exports.updateOrder = (req, res, next) => {
    var orderData = {
        "order": {
            "email": req.body.contact_email,
            "phone": req.body.contact_number,
            "customer": null,
            "shipping_address": {
                "address1": req.body.shipping_address,
                "address2": req.body.shipping_address_optional,
                "city": req.body.shipping_city,
                "company": null,
                "country": req.body.shipping_country,
                "first_name": req.body.shipping_firstname,
                "last_name": req.body.shipping_lastname,
                "zip": req.body.shipping_postal_code,
                "province": null,
                "province_code": null,
                "phone": null,
                "latitude": null,
                "longitude": null
            },
            "send_receipt": true,
            "send_fulfillment_receipt": true,
            "processing_method": "manual",
            "source_name": "web",
            "tags": "custom-frames, frames",
            "gateway": "shopify_payments"
        }
    }

    var orderId = req.body.orderId + '.json';

    req.shopifyToken.put('/admin/api/2019-07/orders/' + orderId, orderData, function(err, response, headers) {
        if (err) {
            //res.sendStatus(500).json(err)
            res.sendStatus(err.status || 500);
            res.render('error');
        }
        res.redirect('success');
    });

}