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
    var filestackId = null;
    var oId = req.params.orderId + '.json';
    req.shopifyToken.get(encodeURI('/admin/api/2019-04/orders/' + oId), function(err, orderData, headers){
        //set variable to hold order
        //res.json(orderData);
        var orders = orderData.order.line_items;
        //iterate orders
        orders.forEach(function(o){
            //get product id
            console.log(o.product_id);
            //request product metafields
            req.shopifyToken.get('/admin/products/'+o.product_id+'/metafields.json', function(err, metaData, headers){
                //res.json(metaData.metafields); 
                //set variable to hold metafields
                //metafield = metaData;
                var metafields = metaData.metafields;
                //iterate metafields
                metafields.forEach(function(m){
                    console.log(m.value); //filestack ID 123456
                    filestackId = m.value;
                }); 
            });
        });

        res.render('order-detail', { title: 'Order', o: orderData, m: filestackId });
    });
    
}