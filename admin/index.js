var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var colours = require("colors")
var uniqid = require("uniqid");

var redis = require("redis");
var clientsClient = redis.createClient({
  host : 'redis',
  db : 1
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post("/client", function(req, res){
  var client_id = uniqid.time();
  var secret = uniqid();
  clientsClient.set(client_id, secret, function(err, body){
    if(err){
      res.status(500).send(err);
    }else{
      res.status(200).send("Client ID: " + client_id + "<br /> Client Secret: " + secret);
    }
  });
});

app.listen(process.env.ADMIN_PORT, function(err){
  err ? console.error(err) : console.log(("Admin Service up at " + process.env.ADMIN_PORT).rainbow);
});
