var async = require("async");
var colours = require("colors");
var geolib = require("geolib");

var redis = require("redis");
var eventsClient = redis.createClient({
  host : 'redis',
  db : 2
});
var usersClient = redis.createClient({
  host : 'redis',
  db : 0
});

var update = function(){
  setTimeout(update, 60 * 1000);
  eventsClient.lrange('_events', 0, -1, function(err, keys){
    var now = Date.now();
    async.each(keys, function(key, cb){
      eventsClient.hget(key, 'over', function(getover_err, is_over){
        if(!is_over){
          eventsClient.hget(key, 'endtime', function(get_err, endtime){
            var enddt = new Date(endtime);
            if(now > enddt){ //If it is past the event's end
              //Archive the event
              eventsClient.hset(key, 'over', 1);
            }else{
              //Check if an hour has passed
              eventsClient.hget(key, 'counter', function(count_err, count){
                if(count == 0){
                  eventsClient.hget(key, 'starttime', function(getstart_err, starttime){
                    var startdt = new Date(starttime);
                    if(startdt.getTime() < now){
                      console.log('Updating score for ' + key);
                      eventsClient.hget(key, 'geo', function(geoerr, geoenabled){
                        if(geoenabled == 'true'){
                          eventsClient.hget(key, 'lat', function(getlat_err, lat){
                            eventsClient.hget(key, 'lng', function(getlng_err, lng){
                              eventsClient.hget(key, 'size', function(getsize_err, size){
                                eventsClient.hget(key, 'participants', function(getpar_err, raw_participants){
                                  var participants = JSON.parse(raw_participants);
                                  async.each(participants, function(participant, cb2){
                                    if(participant.lat && participant.lng){
                                      if(geolib.getDistance({latitude : lat, longitude : lng}, {latitude : participant.lat, longitude : participant.lng}, 10) <= size){
                                        usersClient.hincrby(participant, 'score', 1);
                                      }
                                    }else{
                                      usersClient.hincrby(participant, 'score', 1);
                                    }
                                    cb2();
                                  }, function(){

                                  });
                                });
                              });
                            });
                          });
                        }else{
                          eventsClient.hget(key, 'participants', function(getpar_err, raw_participants){
                            var participants = JSON.parse(raw_participants);
                            async.each(participants, function(participant, cb2){
                              usersClient.hincrby(participant, 'score', 1);
                              cb2();
                            }, function(){

                            });
                          });
                        }
                      });
                    }
                  });
                }
                if(count >= 59){
                  eventsClient.hset(key, 'counter', 0);
                }else{
                  eventsClient.hincrby(key, 'counter', 1);
                }
                cb();
              });
            }
          });
        }
      })
    }, function(){

    });
  });
}

update();

console.log("Updater service is running.".green);
