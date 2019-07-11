const shopifyAPI = require('shopify-node-api');
//set up db connection

module.exports = (req, res, next) => {
    try {
        /**
         * Todo
         * Read meta file for shop config
         */
        req.shopifyToken = new shopifyAPI({
            shop: 'premit', // MYSHOP.myshopify.com
            shopify_api_key: 'ac01c4b159eef8d1751ce21e02c33708', // Your API key
            access_token: 'b3e4d0ca03facfb6c873ff7c68e850eb', // Your API password
            verbose: false
        });
        next();
    } catch (error) {
        res.status(401).json({ message: 'Shopify configuration not set!' });
    }
}