module.exports = (req, res, next) => {
    try {
        req.shopifyToken.get('/admin/api/2019-07/themes.json', function(err, data, headers) {
            var theme_id = null;
            data.themes.forEach(function (item, index) {
                theme_id = item.id;
            });
            req.themeId = theme_id;
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Shopify configuration not set!' });
    }
}