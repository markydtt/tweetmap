function MainCtrl($rootScope, $scope, socket){
  $scope.keywordInput = "";
  $scope.keyWords = new Array();

  socket.on('newTwitt', function (data) {

    // Setup some variables for each tweet to make life easier
    var lat = data.geo.coordinates[0];
    var lng = data.geo.coordinates[1];
    var name = data.user.name;
    var screen_name = data.user.screen_name;
    var tweetText = data.text;
    var displayPicture = data.user.profile_image_url;

    // Post a marker for each new tweet
    var myLatlng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
    });

    // Creating an info window with the tweet content
    var contentString = "<img class='displaypic' src='" + displayPicture + "'><strong>@" + screen_name + "</strong>: " + tweetText;
    // Assign content to the window
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    // Open the tweet info window
    infowindow.open(map, marker);

    // move our map to focus on the new tweet
    var newFocus = new google.maps.LatLng(lat, lng);
    map.setCenter(newFocus);
  });

/*
* showKeywords is used to handle user input validation, creation of the 'Active Keywords' box,
* and compiling the array of keywords, before sending off a request to socket.io to get
* tweets matching the keywords entered.
*
*/
  $scope.addKeywords = function(){
    if ($scope.keywordInput === ''){
      document.getElementById('alert').style.visibility = "visible";
      document.getElementById('alert').innerHTML = badKeywords;
      return;
    }

    // Keywords weren't empty, so make the keyword display visible and hide any error messages
    document.getElementById('alert').style.visibility = "hidden";

    // Separate the keywords
    var newkeywords = $scope.keywordInput.split(' ');
    // Append all keywords into the original array
    $scope.keyWords = $scope.keyWords.concat(newkeywords);

    // Clear the textbox so users can enter more keywords
    $scope.keywordInput = "";
    // Send user's keywords to get some tweets!
    socket.emit('getTweets', $scope.keyWords);
  }

  // Remove the keyword
  $scope.removeKeyword = function(word){
    remove($scope.keyWords, word);
    // Send the stop event if there's no keywords
    if ($scope.keyWords.length == 0){
      socket.emit('stopStream');
      return
    }

    socket.emit('getTweets', $scope.keyWords);
  }
}

function remove(arr, item) {
  for(var i = arr.length; i--;) {
    if(arr[i] === item) {
      arr.splice(i, 1);
    }
  }
}
