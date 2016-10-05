var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product_schema = new Schema({
  imagePath : {type:String, required:true},
  name : {type:String, required:true},
  description : {type:String, required:true},
  price : {type:Number, required:true},
  location : {type:String, required:false},
  lng : {type:String, required:false},
  lat : {type:String, required:false}
});

module.exports = mongoose.model('Product', product_schema);
