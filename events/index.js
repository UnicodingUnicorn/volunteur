var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var basicauth = require("basic-auth");
var colours = require("colors");
var jwt = require("jsonwebtoken");
var secret = process.env.SECRET;

var redis = require("redis");
var eventsClient = redis.createClient({
  host : 'redis',
  db : 2
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
  if(credentials.name && credentials.pass){
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
    message : "Received at Events API"
  });
});

app.get('/event/:name', auth, function(req, res){
  eventsClient.hgetall(req.params.name, function(err, eventfields){
    res.status(200).json({
      message : "Success",
      event : eventfields
    });
  });
});

app.post("/event/new", auth, function(req, res){
  jwt.verify(req.body.token, secret, function(ver_err, decoded){
    if(ver_err){
      res.status(403).json({
        message : "Invalid token"
      });
    }else{
      if(!req.body.name){
        res.status(404).json({
          message : 'Name not found'
        });
      }else if(!req.body.starttime){
        res.status(404).json({
          message : 'Start time not found'
        });
      }else if(!req.body.endtime){
        res.status(404).json({
          message : 'End time not found'
        });
      }else if(!req.body.lat){
        res.status(404).json({
          message : 'Latitude not found'
        });
      }else if(!req.body.lng){
        res.status(404).json({
          message : 'Longitude not found'
        });
      }else if(!req.body.organisation){
        res.status(404).json({
          message : 'Organisation not found'
        });
      }else if(!req.body.description){
        res.status(404).json({
          message : 'Description not found'
        });
      }else if(!req.body.organiser){
        res.status(404).json({
          message : 'Organiser not found'
        });
      }else{
        // if(!(req.body.lat.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/) && req.body.lng.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/))){
        //   res.status(400).json({
        //     message : "Invalid latlng"
        //   });
        // }else{
        //   var startdt = new Date(req.body.starttime);
        //   var enddt = new Date(req.body.endtime);
        //   if(startdt.value <= Date.now()){
        //     res.status(400).json({
        //       message : "Invalid start time"
        //     });
        //   }else if(enddt < startdt){
        //     res.status(400).json({
        //       message : "Invalid end time"
        //     });
        //   }else{
        //     eventsClient.hset(req.body.name, 'starttime', req.body.starttime, redis.print);
        //     eventsClient.hset(req.body.name, 'endtime', req.body.endtime, redis.print);
        //     eventsClient.hset(req.body.name, 'lat', req.body.lat, redis.print);
        //     eventsClient.hset(req.body.name, 'lng', req.body.lng, redis.print);
        //     eventsClient.hset(req.body.name, 'organisation', req.body.organisation, redis.print);
        //     eventsClient.hset(req.body.name, 'organiser', req.body.organiser, redis.print);
        //     eventsClient.hset(req.body.name, 'description', req.body.description, redis.print);
        //     res.status(200).json({
        //       message : "Success"
        //     });
        //   }
        // }
        eventsClient.hset(req.body.name, 'starttime', req.body.starttime, redis.print);
        eventsClient.hset(req.body.name, 'endtime', req.body.endtime, redis.print);
        eventsClient.hset(req.body.name, 'lat', req.body.lat, redis.print);
        eventsClient.hset(req.body.name, 'lng', req.body.lng, redis.print);
        eventsClient.hset(req.body.name, 'organisation', req.body.organisation, redis.print);
        eventsClient.hset(req.body.name, 'organiser', req.body.organiser, redis.print);
        eventsClient.hset(req.body.name, 'description', req.body.description, redis.print);
        eventsClient.hset(req.body.name, 'counter', 0, redis.print);
        eventsClient.hset(req.body.name, 'participants', JSON.stringify([decoded]), redis.print);
        res.status(200).json({
          message : "Success"
        });
      }
    }
  });
});

app.post("/event/update/:name", auth, function(req, res){
  jwt.verify(req.body.token, secret, function(ver_err, decoded){
    if(ver_err){
      res.status(403).json({
        message : "Invalid token"
      });
    }else{
      eventsClient.hget(req.params.name, 'organiser', function(get_err, event_organiser){
        if(event_organiser == decoded){
          if(req.body.starttime)
            eventsClient.hset(req.body.name, 'starttime', req.body.starttime, redis.print);
          if(req.body.endtime)
            eventsClient.hset(req.body.name, 'endtime', req.body.endtime, redis.print);
          if(req.body.lat)
            eventsClient.hset(req.body.name, 'lat', req.body.lat, redis.print);
          if(req.body.lng)
            eventsClient.hset(req.body.name, 'lng', req.body.lng, redis.print);
          if(req.body.organisation)
            eventsClient.hset(req.body.name, 'organisation', req.body.organisation, redis.print);
          if(req.body.description)
            eventsClient.hset(req.body.name, 'description', req.body.description, redis.print);
          if(req.body.organiser)
            eventsClient.hset(req.body.name, 'organiser', req.body.organiser, redis.print);
          res.status(200).json({
            message : "Success"
          });
        }else{
          res.status(404).json({
            message : "Event not found"
          });
        }
      });
    }
  });
});

app.listen(process.env.EVENTS_PORT, function(err){
  err ? console.error(err) : console.log(("Events API up at " + process.env.EVENTS_PORT).rainbow);
});
