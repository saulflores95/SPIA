var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var mongoose = require('mongoose');
var passport = require('passport');

var herokudb = 'mongodb://<pekub:hypogrifo#2016@ds041556.mlab.com:41556/heroku_cqm1l378';

// connect MongoDB
/*mongoose.connect(herokudb, function(err,db){
    if (!err){
        console.log('Connected to /amac!');
    } else{
        console.dir(err); //failed to connect
    }
});*/

mongoose.connect('mongodb://localhost/amac', function(err,db){
    if (!err){
        console.log('Connected to /amac!');
    } else{
        console.dir(err); //failed to connect
    }
});

require('./models/Products');
require('./models/Posts');
require('./models/Comments');
require('./models/Users');

require('./config/passport');

var routes = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
