var fs = require('fs');

module.exports = (req, res, next) => {
    try {
        req.shopifyToken.get('/admin/api/2019-07/themes.json', function(err, data, headers) {
            var theme_id = null;
            data.themes.forEach(function (item, index) {
                theme_id = item.id;
            });
            req.themeId = theme_id;

            const configDataPath    = './public/resources/settings_data.json';
            const configSchemaPath  = './public/resources/settings_schema.json';
            //const headerPath        = './public/resources/header.liquid';
            //const footerPath        = './public/resources/footer.liquid';
            try {
                if (!fs.existsSync(configDataPath)) {
                    req.shopifyToken.get('/admin/themes/'+req.themeId+'/assets.json?asset[key]=config/settings_data.json', function(err, assetData, headers) {
                        fs.writeFile(configDataPath, assetData.asset.value, function (err) {
                            if (err) throw err;
                            console.log('config data created!');
                        });
                    });
                } else {
                    let configdata = fs.readFileSync(configDataPath);
                    req.configSettingsData = JSON.parse(configdata);
                }
                if (!fs.existsSync(configSchemaPath)) {
                    req.shopifyToken.get('/admin/themes/'+req.themeId+'/assets.json?asset[key]=config/settings_schema.json', function(err, assetData, headers) {
                        fs.writeFile(configSchemaPath, assetData.asset.value, function (err) {
                            if (err) throw err;
                            console.log('config schema created!');
                        });
                    });
                } else {
                    let configschema = fs.readFileSync(configSchemaPath);
                    req.configSettingsSchema = JSON.parse(configschema);
                }
                // if (!fs.existsSync(headerPath)) {
                //     req.shopifyToken.get('/admin/themes/'+req.themeId+'/assets.json?asset[key]=sections/header.liquid', function(err, assetData, headers) {
                //         fs.writeFile(headerPath, assetData.asset.value, function (err) {
                //             if (err) throw err;
                //             console.log('header created!');
                //         });
                //     });
                // }
                // if (!fs.existsSync(footerPath)) {
                //     req.shopifyToken.get('/admin/themes/'+req.themeId+'/assets.json?asset[key]=sections/footer.liquid', function(err, assetData, headers) {
                //         fs.writeFile(footerPath, assetData.asset.value, function (err) {
                //             if (err) throw err;
                //             console.log('footer create!');
                //         });
                //     });
                // }
            } catch(err) {
                console.error(err)
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Shopify configuration not set!' });
    }
}