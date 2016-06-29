    var express = require('express');
    var router = express.Router();
    var app = express();
    var session = require('express-session');
    var Featured = require('../models/featured');
    var Users = require('../models/users');
    var passport = require('passport');
    const jwt = require('jsonwebtoken');
    const expressJwt = require('express-jwt');  
    const authenticate = expressJwt({secret : 'printr bhavin'});


    function generateToken(req, res, next) {  
      req.token = jwt.sign({
        id: req.user.id,
      }, 'printr bhavin', {
        expiresIn: 240 * 60 * 60
      });
      next();
    }

    function serialize(req, res, next) {  
      db.updateOrCreate(req.user, function(err, user){
        if(err) {return next(err);}
        // we store the updated information in req.user again
        req.user = {
          id: user.id
        };
        next();
      });
    }

    const db = {  
      updateOrCreate: function(user, cb){
        //db dummy, we just cb the user
        cb(null, user);
      }
    };

    function respond(req, res) {  
        res.status(200).json({
            user: req.user,
            token: req.token
        });
    }

    function authorise(req, res, next) { 
        Users.findById (req.user.id, function(err, user) {
            if (err) throw err;
            // object of  the user
            if (user.userRole != 'admin') {
                res.status(401).json({"statusCode" : 1, "statusMessage" : "Not Authorised!"});
            } else {
                next();
            }
        });
    }

    router.get('/', function(req, res, next) {
      res.render('index', { title: 'Featured Items!' });
    });

    router.post('/signup', function(req, res) {
        Users.register(new Users({ username : req.body.username }), req.body.password, function(err, user) {
            if (err) {
                return res.json({"statusCode" : 1, "statusMessage" : "Error"});
            }
            passport.authenticate('local')(req, res, function () {
                res.json({"statusCode" : 0, "statusMessage" : "Success", "data" : user});
            });
        });
    });

    router.post('/login', passport.authenticate(  
        'local', {
        session: false
        }),
        serialize, generateToken, respond
    );

    //MiddleWare. Authenticate all requests except sign up and login and /.
    router.use(authenticate, function(req, res, next) {
        next(); // make sure we go to the next routes and don't stop here
    });

    router.get('/user/profile', authenticate, function(req, res) { 
        Users.findById (req.user.id, function(err, user) {
          if (err) throw err;
          // object of  the user
          res.json({"statusCode" : 0, "statusMessage" : "Success", "data" : user});
        });
     
    });

    router.route('/featured').get(function(req, res) {
        Featured.find({isActive : true}, function(err, featureds) {
          if (err) throw err;
          res.json({"statusCode" : 0, "statusMessage" : "Success", "data" : featureds }); 
        });    
    });


    //Admin only routes...Requires user role to be in admin. Can currently be only triggered from the DB.

    //show all featuredItems - nonActive included.
    router.route('/featured').get(authorise, function(req, res) {
        Featured.find({}, function(err, featureds) {
          if (err) throw err;
          res.json({"statusCode" : 0, "statusMessage" : "Success", "data" : featureds}); 
        });    
    });

    router.route('/featured')
        //create a featured (accessed at POST http://localhost:8080/api/featureds)
        .post(authorise, function(req, res) {
            var featured = new Featured(req.body); 
            featured.save(function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({"statusCode" : 0, "statusMessage" : "Success", "data" : featured });
                }
            });
    });


    router.route('/featured')
        //update a featured (accessed at POST http://localhost:8080/api/featureds)
        .put(authorise, function(req, res) {
            var id = req.body.id;
            Featured.findByIdAndUpdate(req.body.id, req.body, function(err, featured) {  
                  if (err) {
                    res.send(err);
                } else {
                    res.json({"statusCode" : 0, "statusMessage" : "Success", "data" : featured});
                }
        })
    }); 
  
    router.route('/users').get(authorise, function(req, res) {
        //get all the users
        Users.find({}, function(err, users) {
          if (err) throw err;
          // object of all the users
          res.json("statusCode" : 0, "statusMessage" : "Success", "data" : users}); 
        });    
    });

    router.route('/users')
        //create a user (accessed at POST http://localhost:8080/api/users)
        .post(authorise, function(req, res) {
            var users = new Users(req.body); 
            users.save(function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({"statusCode" : 0, "statusMessage" : "Success", "data" : users});
                }
        });
    });

    router.route('/users')
        //update a user (accessed at POST http://localhost:8080/api/users)
        .put(authorise, function(req, res) {
            var users = new Users(req.body); 
            users.save(function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({ "statusCode" : 0, "statusMessage" : "Success", "data" : users});
                }
        });
    });

    app.use('/api', router);
    module.exports = router;