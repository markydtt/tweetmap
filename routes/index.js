/*
 * GET home page.
 */

var twitter = require('ntwitter');
var io = require('socket.io').listen(3000, {log: false});


io.sockets.on('connection', function(socket){
  
  socket.on('getTweets', function(data){
    var twit = new twitter({
      consumer_key: 'nhyw1Ec3dkl0eSgPwWhw',
      consumer_secret: 'Mo3iRPMNjmVqBN3kpVcr5P2F3AWuCVGjJxuFIqZRmjs',
      access_token_key: '518248696-Eapne6JOwZYAXkarr5Wqd40vcm0U37V7JaBg0rP8',
      access_token_secret: 'ZSIgiBZWzwsQIyWBgfYwTHRKhRpBrrAYsLMOoZDDU'
    });

    twit
      .verifyCredentials(function (err, data) {
        console.log(data);
      })
      .updateStatus('Test tweet from ntwitter/' + twitter.VERSION,
        function (err, data) {
          console.log(data);
        }
    );
  
    twit.stream('statuses/filter',
      // The terms we want to track (Will be user input)
      {track: [data]},
      function(stream) {
        stream.on('data', function (data) {
          if (data.geo != null){
            console.log('Posted near:' + data.geo.coordinates[0] + ' ' + data.geo.coordinates[0] + ' Tweet:' + data.text);
            io.sockets.emit('newTwitt', data);
        }
      });
    });

  });
});



exports.index = function(req, res){
  res.render('index', { title: 'TweetMap'});
};







