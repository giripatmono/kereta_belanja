var express = require('express');
var router = express.Router();
var Order = require('../models/order_model');

// orders
router.get('/', function(req, res) {
  Order.find({})
    .exec(function(err, orders){
      if(err){
        res.send('error occured.');
      } else {
        var title = "Orders";
        res.render('pages/order', {
          title:title,
          orders:orders
        });
      }
    });
})
.get('/:id', function(req, res) {
  Order.findOne({_id:req.params.id})
    .exec(function(err, order){
      if(err){
        res.send('error occured.');
      } else {
        var title = "Order Detail";
        res.render('pages/order_detail', {
          title:title,
          order:order
        });
      }
    });
});

module.exports = router;
