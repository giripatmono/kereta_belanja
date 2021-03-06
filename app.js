var express = require('express');
var session = require('express-session');
var flash = require('express-flash');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

var db = 'mongodb://localhost/kereta_belanja';
mongoose.connect(db);

var routes = require('./routes/index');
var orders = require('./routes/orders');
var checkout = require('./routes/checkout');
var app = express();


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Enable Logging
app.use(logger('dev'));

app.use(session({ secret:'my secret', cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/orders', orders);
app.use('/checkout', checkout);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var server = app.listen(3000, '0.0.0.0', function() {
  console.log('Listening on port %d', server.address().port);
});
