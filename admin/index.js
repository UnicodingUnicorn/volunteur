var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var expresshbs = require("express-handlebars");
var session = require("express-session");

var async = require("async");
var colours = require("colors");
var jwt = require("jsonwebtoken");
var uniqid = require("uniqid");

var redis = require("redis");
var volunteersClient = redis.createClient({
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
app.use(session({
  secret : process.env.COOKIE_SECRET,
  cookie : { maxAge : 1000 * 60 * 60 * 24},
  resave : false,
  saveUninitialized : false
}));

app.use(express.static(__dirname + "/assets"));
app.use((req, res, next) => {
  res.data = {};
  next();
});

var verifySession = (req, resolve, reject) => {
  if(req.session.token){
    jwt.verify(req.session.token, process.env.JWT_SECRET, (ver_err, decoded) => {
      if(ver_err){
        reject();
      }else{
        decoded.username === process.env.ADMIN_ID && decoded.password === process.env.ADMIN_PASSWORD ? resolve() : reject();
      }
    });
  }else{
    reject();
  }
};
var auth = (req, res, next) => {
  verifySession(req, next, () => {
    res.redirect('/');
  });
};

app.engine("handlebars", expresshbs({defaultLayout : "main"}));
app.set("view engine", "handlebars");

app.get('/', function(req, res){
  verifySession(req, () => {
    res.redirect('/clients');
  }, () => {
    res.render('login');
  });
});

app.post('/login', function(req, res){
  if(req.body.username === process.env.ADMIN_ID && req.body.password === process.env.ADMIN_PASSWORD){
    req.session.token = jwt.sign({
      username : req.body.username,
      password : req.body.password
    }, process.env.JWT_SECRET);
    res.redirect('/clients');
  }else{
    res.data.message = "Invalid credentials";
    res.render('login', res.data);
  }
});

app.get('/logout', function(req, res){
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

app.get('/clients', auth, function(req, res){
  res.data.clients = [];
  clientsClient.keys('*', (err, clients) => {
    async.each(clients, (client, cb) => {
      clientsClient.get(client, (get_err, client_secret) => {
        res.data.clients.push({
          id : client,
          secret : client_secret
        });
        cb();
      });
    }, () => {
      res.render('clients', res.data);
    });
  });
});

app.post("/client", auth, function(req, res){
  var client_id = uniqid.time();
  var secret = uniqid();
  clientsClient.set(client_id, secret, (err, body) => {
    res.data.clients = [];
    clientsClient.keys('*', (err, clients) => {
      async.each(clients, (client, cb) => {
        clientsClient.get(client, (get_err, client_secret) => {
          res.data.clients.push({
            id : client,
            secret : client_secret
          });
          cb();
        });
      }, () => {
        if(err){
          res.data.error = err;
          res.render('clients', res.data);
        }else{
          res.data.client_id = client_id;
          res.data.client_secret = secret;
          res.render('clients', res.data);
        }
      });
    });
  });
});

app.get('/volunteers', auth, function(req, res){
  if(req.session.success){
    res.data.success = req.session.success;
    delete req.session.success;
  }
  if(req.session.error){
    res.data.error = req.session.error;
    delete req.session.error;
  }
  res.data.users = [];
  volunteersClient.keys('*', (keys_err, users) => {
    async.each(users, (username, cb) => {
      if(username == '_scores')
        return cb();
      volunteersClient.hgetall(username, (get_err, user_data) => {
        user_data.username = username;
        res.data.users.push(user_data);
        cb();
      });
    }, () => {
      res.render('volunteers', res.data);
    });
  });
});

app.post('/volunteers/volunteer', function(req, res){
  console.log('3');
});

app.post('/volunteer', function(req, res){
  console.log('Received');
  console.log(req.body);
  if(req.body.username){
    if(req.body.name)
      volunteersClient.hset(decoded, 'name', req.body.name);
    if(req.body.password)
      volunteersClient.hset(decoded, 'password', req.body.password)
    if(req.body.score)
      volunteersClient.hset(decoded, 'score', req.body.score);
    if(req.body.bio)
      volunteersClient.hset(decoded, 'bio', req.body.bio);
    if(req.body.events)
      volunteersClient.heset(decoded, 'events', req.body.events);
    req.session.success = "Success!";
    res.redirect('/volunteers');
  }else{
    req.session.error = "No username!";
    res.redirect('/volunteers');
  }
});

app.listen(process.env.ADMIN_PORT, function(err){
  err ? console.error(err) : console.log(("Admin Service up at " + process.env.ADMIN_PORT).green);
});
