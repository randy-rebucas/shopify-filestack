exports.getSuccess = (req, res, next) => {
    res.render('success', {
        title: 'Order Success',
        message: 'Thank you for ordering Print & Frame',
        returnUrl : req.shopifyToken.config.shop
    });
}