var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
  cart : {type: Object, required:true},
  name: {type: String, required:true},
  email: {type: String, required:true},
  address: {type: String, required:true},
  city: {type: String, required:true},
  zipcode: {type: String, required:true},
  payment: {type: String, required:true},
  total_price: {type: Number, required:true}
});

module.exports = mongoose.model('Order', OrderSchema);
