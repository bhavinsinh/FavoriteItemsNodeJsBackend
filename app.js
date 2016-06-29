  var express = require('express');
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var routes = require('./routes/index');
  var users = require('./routes/users');
  var app = express();
  var flash = require('connect-flash');
  var Users = require('./models/users');
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(cookieParser());

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


var session = require('express-session');
var RedisStore = require('connect-redis')(session);


app.use(session({
  store: new RedisStore({
    host: '127.0.0.1',
    port: 6379,
    db: 0
    // pass: 'RedisPASS'
  }),
  cookie : { maxAge : 7 * 24 * 60 * 60 * 1000 },
  resave : false,
  saveUninitialized : true,
  secret: 'printrSecretKey'
}));


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static(path.join(__dirname, 'public')));



  var port = process.env.PORT || 8080;



  passport.use(new LocalStrategy(Users.authenticate()));
  passport.serializeUser(Users.serializeUser());
  passport.deserializeUser(Users.deserializeUser());

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api', routes);
  app.use('/users', users);

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

app.use(flash());
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });




  var mongoose = require('mongoose');
  var db =  mongoose.connect('mongodb://127.0.0.1:27017/featured', function(err) 
      { 
          if (err) { 
              console.log(err); return; 
          }
          else console.log('success in connection 1 ');
  }
  );

  module.exports = passport;
  module.exports = db;
  module.exports = mongoose;
  module.exports = app;
