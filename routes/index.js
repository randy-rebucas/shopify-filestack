const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  
  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecret = process.env.SHOPIFY_API_SECRET;

  const filestackAPI = process.env.FILESTACK_API;
  res.render('index', { 
    title: 'Filestack Shopify API' , 
    apiKey: apiKey, 
    apiSecret: apiSecret,
    filestackAPI: filestackAPI
  });
});

module.exports = router;
