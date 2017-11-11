var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var colours = require("colors");

var nano = require("nano")("http://" + process.env.COUCHDB_USER + ":" + process.env.COUCHDB_PASSWORD + "@couchdb:5984");
var creator = require("couchdb-creator");

var users_design = {
  'views' : {
    'by_username' : {
      'map' : function(doc){
        emit(doc.username, doc._id);
      }
    }
  }
};
var users;
creator(nano, 'users', {name : 'users', doc : users_design}, function(db){
  users = db;
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());

app.get('/', function(req, res){
  res.status(200).json({
    message : "Received at Accounts API"
  });
});

app.post('/user/new', function(req, res){
  if(!req.body.username){

  }else if(!req.body.name){

  }else if(!req.body.password){
    
  }
});

app.get('/user/:username', function(req, res){
  users.get(req.params.username, function(err, body){
    if(err){
      if(err.statusCode == 404){
        res.status(404).json({
          message : "User not found"
        });
      }else{
        res.status(500).json({
          message : err.message
        });
      }
    }else{
      res.status(200).json({
        message : "Success",
        user : body
      });
    }
  });
});



app.listen(process.env.ACCOUNTS_PORT, function(err){
  err ? console.error(err) : console.log(("Accounts API up at " + process.env.ACCOUNTS_PORT).rainbow);
});
