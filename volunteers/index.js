var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var async = require("async");
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
  return next();
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
    message : "Received at Volunteers API"
  });
});

app.post('/login', auth, function(req, res){
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

app.post('/user', auth, function(req, res){
  if(!req.body.username){
    res.status(404).json({
      message : 'Username not found'
    });
  }else if(!req.body.name){
    res.status(404).json({
      message : 'Name not found'
    });
  }else if(!req.body.bio){
    res.status(404).json({
      message : 'Bio not found'
    });
  }else if(!req.body.password){
    res.status(404).json({
      message : 'Password not found'
    });
  }else{
    if(req.body.username == '_scores'){ //Reservd namespace
      res.status(400).json({
        message : "Reserved username"
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
          usersClient.hset(req.body.username, 'events', JSON.stringify([]));
          usersClient.hset(req.body.username, 'score', 0);

          res.status(200).json({
            message : "Success"
          });
        }
      });
    }
  }
});

app.post('/user/update', auth, function(req, res){
  jwt.verify(req.body.token, secret, function(ver_err, decoded){
    if(ver_err){
      res.status(403).json({
        message : "Invalid token"
      });
    }else{
      usersClient.hgetall(decoded, function(err, user){
        if(user){
          if(req.body.name)
            usersClient.hset(decoded, 'name', req.body.name);
          if(req.body.password)
            usersClient.hset(decoded, 'password', req.body.password)
          if(req.body.organisation)
            usersClient.hset(decoded, 'organisation', req.body.organisation);
          if(req.body.bio)
            usersClient.hset(decoded, 'bio', req.body.bio);
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

app.get('/user', auth, function(req, res){
  var getUser = function(username){
    usersClient.hgetall(username, function(err, userfields){
      if(userfields){
        delete userfields.password;
        userfields.username = username;
        userfields.events = JSON.parse(userfields.events);
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
  };
  if(req.query.token){
    jwt.verify(req.query.token, secret, function(ver_err, decoded){
      if(ver_err){
        res.status(403).json({
          message : "Invalid token"
        });
      }else{
        getUser(decoded);
      }
    });
  }else if(req.query.username){
    getUser(req.query.username);
  }else{
    res.status(400).json({
      message : "Username not specified"
    });
  }
});

app.post('/position', auth, function(req, res){
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

app.get('/scores', function(req, res){
  if(!req.query.count)
    req.query.count = -1;
  usersClient.zrevrange('_scores', 0, req.query.count, (err, leaders) => {
    var return_data = [];
    var i = 1;
    async.eachSeries(leaders, (leader, cb) => {
      usersClient.hget(leader, 'score', (get_err, score) => {
        return_data.push({
          user : leader,
          score : score,
          place : i
        });
        i++;
        cb();
      });
    }, () => {
      res.status(200).json({
        message : "Success",
        users : return_data
      });
    })
  });
});

app.listen(process.env.VOLUNTEERS_PORT, function(err){
  err ? console.error(err) : console.log(("Volunteers API up at " + process.env.VOLUNTEERS_PORT).green);
});
