exports.getTheme = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-07/themes/'+req.themeId+'/assets.json?asset[key]=templates/index.liquid&theme_id='+req.themeId, function(err, themedata, headers) {
        res.json(themedata);
    });
}

exports.createSnippet = (req, res, next) => {
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

exports.getThemeAssets = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-04/themes/'+req.themeId+'/assets.json', function(err, assetsData, headers) {
        console.log(assetsData);
    });
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