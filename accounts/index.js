var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var basicauth = require("basic-auth");
var colours = require("colors");
var jwt = require("jsonwebtoken");
var secret = process.env.SECRET;

var redis = require("redis");
var usersClient = redis.createClient({
  host : 'redis',
  db : 0
});
var clientsClient = redis.createClient({
  host : 'redis',
  db : 1
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());

var auth = function(req, res, next){
  var credentials = basicauth(req);
  if(credentials && credentials.name && credentials.pass){
    clientsClient.get(credentials.name, function(err, pass){
      if(err){
        res.status(403).json({
          message : "No client credentials"
        });
      }else{
        if(credentials.pass == pass){
          next();
        }else{
          res.status(403).json({
            message : "Invalid client pass"
          });
        }
      }
    });
  }else{
    res.status(403).json({
      message : "No client credentials"
    });
  }
};

app.get('/', function(req, res){
  res.status(200).json({
    message : "Received at Accounts API"
  });
});

app.post('/login', function(req, res){
  if(!req.body.username){
    res.status(404).json({
      message : 'Username not found'
    });
  }else if(!req.body.password){
    res.status(404).json({
      message : 'Password not found'
    });
  }else{
    usersClient.hget(req.body.username, 'password', function(err, password){
      if(req.body.password === password){
        var token = jwt.sign(req.body.username, secret);
        res.status(200).json({
          message : "Success",
          token : token
        });
      }else{
        res.status(403).json({
          message : "Invalid password"
        });
      }
    });
  }
});

app.post('/user/new', auth, function(req, res){
  if(!req.body.username){
    res.status(404).json({
      message : 'Username not found'
    });
  }else if(!req.body.name){
    res.status(404).json({
      message : 'Name not found'
    });
  }else if(!req.body.password){
    res.status(404).json({
      message : 'Password not found'
    });
  }else{
    usersClient.exists(req.body.username, function(err, user_exists){
      if(user_exists){
        res.status(400).json({
          message : "User already exists"
        });
      }else{
        usersClient.hset(req.body.username, 'name', req.body.name);
        usersClient.hset(req.body.username, 'password', req.body.password);
        usersClient.hset(req.body.username, 'bio', req.body.bio);
        usersClient.hset(req.body.username, 'events', JSON.stringify([]))
        res.status(200).json({
          message : "Success"
        });
      }
    });
  }
});

app.post('/user/update/:token', auth, function(req, res){
  jwt.verify(req.params.token, secret, function(ver_err, decoded){
    if(ver_err){
      res.status(403).json({
        message : "Invalid token"
      });
    }else{
      usersClient.hgetall(decoded, function(err, user){
        if(user){
          if(req.body.name)
            usersClient.hset(decoded, 'name', req.body.name, redis.print);
          if(req.body.password)
            usersClient.hset(decoded, 'password', req.body.password, redis.print)
          if(req.body.organisation)
            usersClient.hset(decoded, 'organisation', req.body.organisation, redis.print);
          if(req.body.bio)
            usersClient.hset(decoded, 'bio', req.body.bio, redis.print);
          res.status(200).json({
            message : "Success"
          });
        }else{
          res.status(404).json({
            message : "User not found"
          });
        }
      });
    }
  });
});

app.get('/user/:username', auth, function(req, res){
  usersClient.hgetall(req.params.username, function(err, userfields){
    if(userfields){
      delete userfields.password;
      userfields.username = req.params.username;
      res.status(200).json({
        message : "Success",
        user : userfields
      });
    }else{
      res.status(404).json({
        message : 'User not found'
      });
    }
  });
});

app.get('/user/token/:token', auth, function(req, res){
  jwt.verify(req.params.token, secret, function(ver_err, decoded){
    if(ver_err){
      res.status(403).json({
        message : "Invalid token"
      });
    }else{
      usersClient.hgetall(decoded, function(err, userfields){
        if(userfields){
          delete userfields.password;
          userfields.username = decoded;
          res.status(200).json({
            message : "Success",
            user : userfields
          });
        }else{
          res.status(404).json({
            message : 'User not found'
          });
        }
      });
    }
  });
});

app.post('/position/report', function(req, res){
  jwt.verify(req.body.token, secret, function(ver_err, decoded){
    if(ver_err){
      res.status(403).json({
        message : "Invalid token"
      });
    }else{
      if(!req.body.lat){
        res.status(404).json({
          message : 'Lat not found'
        });
      }else if(!req.body.lng){
        res.status(404).json({
          message : 'Lng not found'
        });
      }else{
        usersClient.exists(decoded, function(exists_err, client_exists){
          if(client_exists){
            usersClient.hset(decoded, 'lat', req.body.lat);
            usersClient.hset(decoded, 'lng', req.body.lng);

            res.status(200).json({
              message : "Success"
            });
          }else{
            res.status(404).json({
              message : "User not found"
            });
          }
        });
      }
    }
  });
});

app.listen(process.env.ACCOUNTS_PORT, function(err){
  err ? console.error(err) : console.log(("Accounts API up at " + process.env.ACCOUNTS_PORT).green);
});
