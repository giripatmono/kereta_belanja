var express = require('express');
var router = express.Router();

// index page
router.get('/', function(req, res) {
  var products = [
        { name: 'Apel', location: "Malang", baseprice:2000, geolocation:"-7.978644,112.5967635" },
        { name: 'Jeruk', location: "Bali", baseprice:2000, geolocation:"-8.4553561,114.7913883" },
        { name: 'Bawang Merah', location: "Brebes", baseprice:2000, geolocation:"-6.865172,109.0089218" }
    ];
    var title = "Product List";

    res.render('pages/index', {
      title:title,
      products:products
    });
});

// cart page
router.get('/cart', function(req, res) {
  var title = "My Shopping Cart";

  res.render('pages/cart', {
    title:title
  });
});

// checkout page
router
.get('/checkout', function(req, res) {
  var title = "Checkout";

  res.render('pages/checkout', {
    title:title
  });
})
.post('/checkout', function(req, res){
  console.dir(req.body);
  res.send('Checkout success!!');
});

module.exports = router;
