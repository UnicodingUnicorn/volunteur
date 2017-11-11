var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var async = require("async");
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

app.get('/events', function(req, res){
  eventsClient.lrange('_events', 0, -1, function(err, events){
    var events_data = [];
    async.each(events, function(eventname, cb){
      eventsClient.hgetall(eventname, function(get_err, eventdata){
        eventdata.name = eventname;
        eventdata.participants = JSON.parse(eventdata.participants);
        events_data.push(eventdata);
        cb();
      });
    }, function(){
      res.status(200).json({
        message : "Success",
        events : events_data
      });
    });
  });
});

app.get('/events/:count', function(req, res){
  eventsClient.lrange('_events', 0, req.params.count - 1, function(err, events){
    var events_data = [];
    async.each(events, function(eventname, cb){
      eventsClient.hgetall(eventname, function(get_err, eventdata){
        eventdata.name = eventname;
        eventdata.participants = JSON.parse(eventdata.participants);
        events_data.push(eventdata);
        cb();
      });
    }, function(){
      res.status(200).json({
        message : "Success",
        events : events_data
      });
    });
  });
});

app.get('/events/:offset/:count', function(req, res){
  eventsClient.lrange('_events', req.params.offset, req.params.offset + req.params.count -1, function(err, events){
    var events_data = [];
    async.each(events, function(eventname, cb){
      eventsClient.hgetall(eventname, function(get_err, eventdata){
        eventdata.name = eventname;
        eventdata.participants = JSON.parse(eventdata.participants);
        events_data.push(eventdata);
        cb();
      });
    }, function(){
      res.status(200).json({
        message : "Success",
        events : events_data
      });
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
        eventsClient.exists(req.body.name, function(err, exists){
          if(exists){
            res.status(400).json({
              message : "Event with name already exists"
            });
          }else{
            eventsClient.lpush('_events', req.body.name, redis.print);

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

app.post("/event/adduser", function(req, res){
  jwt.verify(req.body.token, secret, function(ver_err, decoded){
    if(ver_err){
      res.status(403).json({
        message : "Invalid token"
      });
    }else{
      eventsClient.hget(req.body.name, 'participants', function(get_err, raw_participants){
        if(raw_participants){
          var participants = JSON.parse(raw_participants);
          participants.push(decoded);
          eventsClient.hset(req.body.name, 'participants', JSON.stringify(participants), redis.print);
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
  err ? console.error(err) : console.log(("Events API up at " + process.env.EVENTS_PORT).green);
});
