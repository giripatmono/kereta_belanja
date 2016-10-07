var express = require('express');
var router = express.Router();
var Order = require('../models/order_model');

// checkout page
router
.get('/', function(req, res) {
  var title = "Checkout";

  res.render('pages/checkout', {
    title:title
  });
})
.post('/', function(req, res){
  console.dir(req.body);

  // compile order data
  var cart = [];
  for(var i=0;i<req.body.productname.length;i++){
      cart.push({
        "productname":req.body.productname[i],
        "amount":req.body.amount[i],
        "subtotal":req.body.subtotal[i],
      });
  }
  var order = new Order({
    cart :  cart,
    name : req.body.name,
    email : req.body.email,
    address : req.body.address,
    city : req.body.city,
    zipcode : req.body.zipcode,
    payment : req.body.payment,
    total_price : req.body.total_price,
  });

  // save order
  order.save(function(err, result){
    res.redirect('/orders');
  });

});

module.exports = router;
