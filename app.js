var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var app = express();

mongoose.connect('mongodb://localhost/kereta_belanja');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Enable Logging
app.use(logger('dev'));
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var server = app.listen(3000, '0.0.0.0', function() {
  console.log('Listening on port %d', server.address().port);
});
