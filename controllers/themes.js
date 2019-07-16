exports.getTheme = (req, res, next) => {
    /*req.shopifyToken.get('/admin/api/2019-07/themes/'+theme_id+'/assets.json?asset[key]=templates/index.liquid&theme_id='+theme_id, function(err, assetsdata, headers) {
        res.json(assetsdata);
    });*/
    /*req.shopifyToken.get('/admin/api/2019-04/themes/'+theme_id+'/assets.json', function(err, assetsdata, headers) {
        console.log(assetsdata);
    });*/
}

exports.createSnippet = (req, res, next) => {

    req.shopifyToken.get('/admin/api/2019-07/themes.json', function(err, data, headers) {
        var theme_id = null;
        data.themes.forEach(function (item, index) {
            theme_id = item.id;
        });
        var assetSnippet = {
            "asset": {
                "key": "snippets/products.filestack_source_fields.liquid",
                "value": `
                        <style>
                            .product-metafield {
                                padding: 0 0 1em 0;
                            }
                        </style>
                        {% assign filestack = product.metafields.filestack %}
                        {% assign key = 'filestackId' %}
                        <a href="{{ filestack[key] }}" target="_blank">View source image</a>`
            }
        }
        req.shopifyToken.put('/admin/api/2019-07/themes/'+theme_id+'/assets.json', assetSnippet, function(err, data, headers) {
            //res.json(data);
            res.redirect('/');
        });
    });
}

exports.getThemeAssets = (req, res, next) => {
    /*req.shopifyToken.get('/admin/api/2019-04/themes/'+themeId+'/assets.json', function(err, data, headers) {
        var themeId = null;
        console.log(data);
    });*/
}

exports.createConfig = (req, res, next) => {
    var assetConfig = {
        "asset": {
            "key": "config/filestack_data.json",
            "value": `{"key":"AJ4LGjGJKS4uws5q8QCraz"}`
        }
    }
    req.shopifyToken.put('/admin/api/2019-07/themes/'+req.themeId+'/assets.json', assetConfig, function(err, data, headers) {
        res.redirect('/');
    });
}

exports.downloadFile = (req, res, next) => {
    var file = req.params.file;
    var fileLocation = './public/downloads/'+file;
    console.log(fileLocation);
    res.download(fileLocation, file);
}