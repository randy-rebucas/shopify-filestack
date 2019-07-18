exports.getOrders = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-04/orders.json', function(err, data, headers) {
        //res.json(data);
        res.render('orders', {
            title: 'Orders',
            orders: data.orders
        });
    });
}

exports.getOrder = (req, res, next) => {
    var orderJasonFile = req.params.orderId + '.json';
    req.shopifyToken.get(encodeURI('/admin/api/2019-04/orders/' + orderJasonFile), function(err, orderData, headers) {
        //set variable to hold order
        //res.json(orderData.order.name);
        pageTitle = 'Order ' + orderData.order.name;
        var orders = orderData.order.line_items;
        for (let o = 0; o < orders.length; o++) {
            //orders
            req.shopifyToken.get('/admin/products/' + orders[o].product_id + '/metafields.json', function(err, metaData, headers) {
                var metafields = metaData.metafields;
                for (let m = 0; m < metafields.length; m++) {
                    res.render('order-detail', { title: 'Order', 'page_title': pageTitle, 'o': orderData, 'm': metafields[m].value });
                }
            });
        }
    });
}

exports.updateOrder = (req, res, next) => {
    console.log(req.body);

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
            "gateway": "shopify_payments",
            "taxes_included": true,
            "financial_status": "pending",
            "referring_site": req.get('host'),
            "browser_ip": req.header('x-forwarded-for') || req.connection.remoteAddress
        }
    }

    var orderId = req.body.orderId + '.json';

    req.shopifyToken.put('/admin/api/2019-07/orders/' + orderId, orderData, function(err, data, headers) {
        res.redirect('success');
        //res.redirect('products/create');
    });
}