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
    var oId = req.params.orderId + '.json';
    req.shopifyToken.get(encodeURI('/admin/api/2019-04/orders/' + oId), function(err, data, headers){
        res.json(data);
        //res.render('order-detail', { title: 'Order', order: data });
	});
}