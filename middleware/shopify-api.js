const shopifyAPI = require('shopify-node-api');
//set up db connection

module.exports = (req, res, next) => {
    try {
        /**
         * Todo
         * Read meta file for shop config
         */
        req.shopifyToken = new shopifyAPI({
            shop: 'benmessina', // MYSHOP.myshopify.com
            shopify_api_key: '13cd2e9b77be61944e72517e2bd9cf99', // Your API key
            access_token: '480cd45438165a9b962b96db2c9e37ea', // Your API password
            verbose: false
        });
        next();
    } catch (error) {
        res.status(401).json({ message: 'Shopify configuration not set!' });
    }
}