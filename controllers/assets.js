exports.getFilestackAssets = (req, res, next) => {
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
            req.shopifyToken.get('/admin/api/2019-07/themes/'+req.themeId+'/assets.json', function(err, assetData, headers) {
                console.log(req.shopifyToken.config.shop);
                res.render('index', {
                    title: 'Filestack Shopify API',
                    filastackApi: configKey,
                    snippetFile: snippetKey,
                    assetList: assetData,
                    configSettings: req.configSettingsData,
                    configSchema: req.configSettingsSchema,
                    storeName: req.shopifyToken.config.shop
                });
            });
        });
    });
}

exports.createFilestackSnippetAssets = (req, res, next) => {
    var assetSnippet = {
        "asset": {
            "key": "snippets/products.filestack_source_fields.liquid",
            "value": `<div style="padding: 0 0 1em 0;">
                    {% assign filestack = product.metafields.filestack %}
                    {% assign key = 'filestackId' %}
                    <a href="{{ filestack[key] }}" target="_blank">View source image</a></div>`
        }
    }
    req.shopifyToken.put('/admin/api/2019-07/themes/'+req.themeId+'/assets.json', assetSnippet, function(err, snippetData, headers) {
        res.redirect('/');
    });
}

exports.createFilestackConfigAssets = (req, res, next) => {
    req.shopifyToken.delete('/admin/api/2019-07/themes/'+req.themeId+'/assets.json?asset[key]=config/filestack_data.json', function(err, configData, headers) {
        var assetConfig = {
            "asset": {
                "key": "config/filestack_data.json",
                "value": `{
                    "key": "${req.body.fs_API}"
                }`
            }
        }
        req.shopifyToken.put('/admin/api/2019-07/themes/'+req.themeId+'/assets.json', assetConfig, function(err, data, headers) {
            res.redirect('/');
        });
    });
}