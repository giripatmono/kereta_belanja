var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kereta_belanja');

var products = [
    new Product({
      imagePath:'/images/350_150.png',
      name:'Apel',
      description:'',
      price:2000,
      location:'Malang',
      lng:'-7.978644',
      lat:'112.5967635'
    }),

    new Product({
      imagePath:'/images/350_150.png',
      name:'Jeruk',
      description:'',
      price:2000,
      location:'Bali',
      lng:'-8.4553561',
      lat:'114.7913883'
    }),

    new Product({
      imagePath:'/images/350_150.png',
      name:'Bawang Merah',
      description:'',
      price:2000,
      location:'Brebes',
      lng:'-6.865172',
      lat:'109.0089218'
    }),

  ]

for (i = 0; i < products.length; i++) {
  products[i].save()
}

mongoose.disconnect();
