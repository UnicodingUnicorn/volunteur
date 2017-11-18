var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({
  fileSize : 2000000000, //2GB
  storage : storage
});

var basicauth = require("basic-auth");
var colors = require("colors");
var uniqid = require("uniqid");

var minio = require("minio");
var mClient = new minio.Client({
  endPoint : 'minio',
  port : 9000,
  secure : false,
  accessKey : process.env.MINIO_ACCESS_KEY,
  secretKey : process.env.MINIO_SECRET_KEY
});
mClient.bucketExists('files', function(err){
  if(err){
    if(err.code == 'NoSuchBucket'){
      console.log("Creating bucket files...");
      mClient.makeBucket('files', 'ap-southeast-1', function(make_err){
        make_err ? console.error(make_err) : console.log("Bucket 'files' successfully created.");
      });
    }else{
      console.error(err);
    }
  }else{
    console.log("Bucket 'files' already exists");
  }
});

var app = express()
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
    message : "Received at Fileserve service"
  });
});

app.get('/file/:filename', function(req, res){
  mClient.getObject('files', req.params.filename, function(err, stream){
    if(err){
      if(err.code == 'NoSuchKey'){
        res.status(404).json({
          message : "No such file"
        });
      }else{
        res.status(500).json({
          message : "Error retrieving file"
        });
      }
    }else{
      stream.pipe(res);
    }
  });
});

app.post('/file', auth, upload.single('file'), function(req, res){
  if(!req.file){
    res.status(404).json({
      message : "No file found."
    });
  }else{
    mClient.bucketExists('files', function(exists_err){
      if(exists_err){
        res.status(500).json({
          message : "Storage does not exist."
        });
      }else{
        var fileName = uniqid() + '.' + req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        mClient.putObject('files', fileName, req.file.buffer, function(put_err, etag){
          if(put_err){
            res.status(500).json({
              message : "Error storing file"
            });
          }else{
            res.status(200).json({
              message : "Success",
              filename : fileName
            });
          }
        });
      }
    });
  }
});

app.listen(process.env.FILESERVE_PORT, function(err){
  err ? console.error(err) : console.log(("Fileserve service up at " + process.env.FILESERVE_PORT).green);
});
