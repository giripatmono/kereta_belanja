var express = require('express');
var router = express.Router();

// index page
router.get('/', function(req, res) {
  var products = [
        { name: 'Apel', location: "Malang", price:2000, geolocation:"" },
        { name: 'Jeruk', location: "Bali", price:2000, geolocation:"" },
        { name: 'Bawang Merah', location: "Brebes", price:2000, geolocation:"" }
    ];
    var title = "Product List";

    res.render('pages/index', {
      title:title,
      products:products
    });
});

// cart page
router.get('/cart', function(req, res) {
  var carts = [
        { name: 'Apel', amount:2, subtotal:4000 },
        { name: 'Jeruk', amount:3, subtotal:6000 }
    ];
  var title = "My Shopping Cart";

  var total_items = 0, total_price=0;
  for (i = 0; i < carts.length; i++) {
      total_items += carts[i].amount ;
      total_price += carts[i].subtotal ;
  }

  res.render('pages/cart', {
    title:title,
    carts:carts,
    total_items:total_items,
    total_price:total_price
  });
});

module.exports = router;
