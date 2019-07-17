exports.getOrders = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-04/orders.json', function(err, data, headers){
        //res.json(data);
        res.render('orders', {
            title: 'Orders',
            orders: data.orders
        });
	});
}

exports.getOrder = (req, res, next) => {
    var orderJasonFile = req.params.orderId + '.json';
    req.shopifyToken.get(encodeURI('/admin/api/2019-04/orders/' + orderJasonFile), function(err, orderData, headers){
        //set variable to hold order
        //res.json(orderData.order.name);
        pageTitle = 'Order ' + orderData.order.name;
        var orders = orderData.order.line_items;
        for (let o = 0; o < orders.length; o++) {
            //orders
            req.shopifyToken.get('/admin/products/'+orders[o].product_id+'/metafields.json', function(err, metaData, headers){    
                var metafields = metaData.metafields;
                for (let m = 0; m < metafields.length; m++) {
                    res.render('order-detail', { title: 'Order', 'page_title':pageTitle, 'o': orderData, 'm': metafields[m].value });
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
            "fulfillment_status": null,
            "financial_status": "pending",
            "send_receipt": true,
            "send_fulfillment_receipt": true,
            "customer": {
                "first_name": req.body.cus_firstname,
                "last_name": req.body.cus_lastname,
                "email": req.body.cus_email,
            },
            "shipping_address": {
                "first_name": req.body.shipping_firstname,
                "last_name": req.body.shipping_lastname,
                "address1": req.body.shipping_address,
                "city": req.body.shipping_city,
                "country": req.body.shipping_country,
                "zip": req.body.shipping_postal_code,
            },
            "billing_address": {
                "first_name": req.body.billing_firstname,
                "last_name": req.body.billing_lastname,
                "address1": req.body.billing_address,
                "city": req.body.billing_city,
                "country": req.body.billing_country,
                "zip": req.body.billing_postal_code,
            },
            "transactions": [
                {
                    "kind": "capture",
                    "status": "pending",
                    "currency": "USD",
                    "amount": "10.00"
                }
            ]
        }
    }

    var orderId = req.body.orderId; + '.json';

    req.shopifyToken.put('/admin/api/2019-07/orders/'+orderId, orderData, function(err, orderdata, headers) {
        res.redirect('success');
    });
}
