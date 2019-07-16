exports.getShop = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-04/metafields.json', function(err, data, headers) {
        res.render('index', {
            title: 'Filestack Shopify API',
            metafields: data.metafields
        });
    });
}

exports.createShop = (req, res, next) => {
    var val = req.body;
    var metafileds_data = {
        "metafield": {
            "namespace": "fs_api",
            "key": "filestackAPI",
            "value": val.filestackAPI,
            "value_type": "string"
        }
    }
    req.shopifyToken.post('/admin/api/2019-04/metafields.json', metafileds_data, function(err, data, headers) {
        res.redirect('/');
    });
}