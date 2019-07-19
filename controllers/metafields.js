exports.getShop = (req, res, next) => {
    req.shopifyToken.get('/admin/themes/'+req.themeId+'/assets.json?asset[key]=config/filestack_data.json', function(err, configData, headers) {
        var configKey = null;
        if(Object.keys(configData).length) {
            var config = JSON.parse(configData.asset.value);
            var configKey = config.key;
        }
        req.shopifyToken.get('/admin/themes/'+req.themeId+'/assets.json?asset[key]=snippets/products.filestack_source_fields.liquid', function(err, snipetData, headers) {
            var snippetKey = false;
            if(Object.keys(snipetData).length) {
                var snippetKey = true;
            }
            res.render('index', {
                title: 'Filestack Shopify API',
                filastackApi: configKey,
                snippetFile: snippetKey,
            });
        });
    });
}

exports.createMetafield = (req, res, next) => {
    var val = req.body;
    console.log(val);
    // var metafileds_data = {
    //     "metafield": {
    //         "namespace": "fs_api",
    //         "key": "filestackAPI",
    //         "value": val.filestackAPI,
    //         "value_type": "string"
    //     }
    // }
    // req.shopifyToken.post('/admin/api/2019-04/metafields.json', metafileds_data, function(err, data, headers) {
    //     res.redirect('/');
    // });
}