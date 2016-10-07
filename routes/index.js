var express = require('express');
var router = express.Router();
var Product = require('../models/product_model');

// index page
router.get('/', function(req, res) {
    //var products = [
    //    { name: 'Apel', location: "Malang", baseprice:2000, geolocation:"-7.978644,112.5967635" },
    //    { name: 'Jeruk', location: "Bali", baseprice:2000, geolocation:"-8.4553561,114.7913883" },
    //    { name: 'Bawang Merah', location: "Brebes", baseprice:2000, geolocation:"-6.865172,109.0089218" }
    //];
    Product.find(function(err, products){
      var title = "Product List";
      res.render('pages/index', {
        title:title,
        products:products
      });
    });
});

// cart page
router.get('/cart', function(req, res) {
  var title = "My Shopping Cart";

  res.render('pages/cart', {
    title:title
  });
});

module.exports = router;
