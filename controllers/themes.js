exports.getTheme = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-07/themes/'+req.themeId+'/assets.json?asset[key]=templates/index.liquid&theme_id='+req.themeId, function(err, themedata, headers) {
        res.json(themedata);
    });
}

exports.getThemeAssets = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-04/themes/'+req.themeId+'/assets.json', function(err, assetsData, headers) {
        console.log(assetsData);
    });
}