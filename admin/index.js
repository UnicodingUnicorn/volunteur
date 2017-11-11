var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var colours = require("colors")
var uniqid = require("uniqid");

var nano = require("nano")("http://" + process.env.COUCHDB_USER + ":" + process.env.COUCHDB_PASSWORD + "@couchdb:5984");
var creator = require("couchdb-creator");

var clients;
creator(nano, 'clients', function(db){
  clients = db;
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post("/client", function(req, res){
  if(!req.body.name){
    res.status(400).send("No client name");
  }else if(!req.body.redirect_uri){
    res.status(400).json("No redirect uri");
  }else{
    var client = {
      name : req.body.name,
      secret : uniqid(),
      redirect_uris : [req.body.redirect_uri]
    };
    clients.insert(client, uniqid(), function(err, body){
      if(err){
        res.status(500).json({
          message : err.message
        });
      }else{
        clients.get(body.id, function(g_err, client){
          res.status(200).send("Success! Client ID: " + client._id + " Client secret: " + client.secret);
        });
      }
    });
  }
});

app.listen(process.env.ADMIN_PORT, function(err){
  err ? console.error(err) : console.log(("Admin Service up at " + process.env.ADMIN_PORT).rainbow);
});
