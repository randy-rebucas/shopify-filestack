module.exports = (req, res, next) => {
    try {
        req.shopifyToken.get('/admin/themes/' + req.themeId + '/assets.json?asset[key]=config/filestack_data.json', function(err, data, headers) {
            if (err) {
                res.sendStatus(500).json(err)
            }
            var apiKey = null;
            if (Object.keys(data).length) {
                var config = JSON.parse(data.asset.value);
                var apiKey = config.key;
            }
            req.filestackApi = apiKey;
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Filestack error' });
    }
}

