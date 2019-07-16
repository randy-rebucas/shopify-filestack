function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

exports.getShop = (req, res, next) => {
    req.shopifyToken.get('/admin/themes/'+req.themeId+'/assets.json?asset[key]=config/filestack_data.json', function(err, configData, headers) {
        var configKey = null;
        if(!isEmpty(configData)) {
            var config = JSON.parse(configData.asset.value);
            var configKey = config.key;
        }
        req.shopifyToken.get('/admin/themes/'+req.themeId+'/assets.json?asset[key]=snippets/products.filestack_source_fields.liquid', function(err, snipetData, headers) {
            var snippetKey = false;
            console.log(snipetData);
            if(!isEmpty(snipetData)) {
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