
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var twitter = require('ntwitter');

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server, {log: false});

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var terms = [];

// Single connection per user
io.sockets.on('connection', function(socket){
  var twit = new twitter({
    consumer_key: 'nhyw1Ec3dkl0eSgPwWhw',
    consumer_secret: 'Mo3iRPMNjmVqBN3kpVcr5P2F3AWuCVGjJxuFIqZRmjs',
    access_token_key: '518248696-Eapne6JOwZYAXkarr5Wqd40vcm0U37V7JaBg0rP8',
    access_token_secret: 'ZSIgiBZWzwsQIyWBgfYwTHRKhRpBrrAYsLMOoZDDU'
  });

  // Start the stream
  socket.on('getTweets', function(data){
    if (data.remove != null){
      remove(terms, data.remove);
      if (!terms.length){
        return
      };
    };

    if (data.add != null){
      terms = terms.concat(data.add);
    };
    console.log(terms);

    twit.stream('statuses/filter',
      // The terms we want to track (Will be user input)
      {track: terms},
      function(stream) {
        stream.on('data', function (data) {
          if (data.geo != null){
            console.log('Posted near:' + data.geo.coordinates[0] + ' ' + data.geo.coordinates[0] + ' Tweet:' + data.text);
            io.sockets.emit('newTwitt', data);
          }
        });
        stream.on('end', function (response) {
          console.log("Client disconnected");
        });
        stream.on('destroy', function (response) {
        // Handle a 'silent' disconnection from Twitter, no end/error event fired
          console.log("Stream Destroyed");
        });
        stream.on('error', function(error, code) {
          console.log("My error: " + error + ": " + code);
        });
    });
  });
});

function remove(arr, item) {
  for(var i = arr.length; i--;) {
    if(arr[i] === item) {
      arr.splice(i, 1);
      return
    }
  }
}
