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
