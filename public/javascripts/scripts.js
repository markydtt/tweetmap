
var wordList = document.getElementById('words');
// Declare map variable here for to keep inside scope
var map;
// Create the empty keyword array
var keywords = new Array();

var badKeywords = "<h2>Error!</h2> Please make sure that you have entered at least one keyword";
var badLocation = "<h2>Error!</h2> Please ensure that you've entered a valid location!"

// Get the map setup with our map-canvas div
function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);


// Get socket.io connected and emitting tweets
var socket = io.connect('http://localhost:3000');
socket.on('newTwitt', function (data) {

    // Setup some variables for each tweet to make life easier
    var lat = data.geo.coordinates[0];
    var lng = data.geo.coordinates[1];
    var name = data.user.name;
    var screen_name = data.user.screen_name;
    var tweetText = data.text;
    var displayPicture = data.user.profile_image_url;

    // Check each tweet is near our location
    if (checkRadius(lat, lng)){

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
    }
});




/*
* showKeywords is used to handle user input validation, creation of the 'Active Keywords' box,
* and compiling the array of keywords, before sending off a request to socket.io to get 
* tweets matching the keywords entered.
*
*/
function showKeywords() {
    var data = '';
    var keywordInput = document.getElementById('keywordSearch').value;

    if (keywordInput == '' | keywordInput == null){
      document.getElementById('alert').style.visibility = "visible";
      document.getElementById('alert').innerHTML = badKeywords;
      return false;
    }

    // Keywords weren't empty, so make the keyword display visible and hide any error messages
    document.getElementById('keywordDisplay').style.visibility = "visible";
    document.getElementById('alert').style.visibility = "hidden";
    
    // create second array for any new keywords
    var newkeywords = new Array();
    // Separate the keywords 
    newkeywords = keywordInput.split(' ');
    // Append all keywords into the original array
    keywords = keywords.concat(newkeywords);

    // Iterate through the array and add the keywords to the display
    // also remove any empty keywords
    words.innerHTML = '';
    for (var i = 0; i < keywords.length; i++) {
        // Remove any additional spaces that a user may have entered
        if (keywords[i] == " " | keywords[i] == "") {
            keywords.splice(i, 1);
        }
        // Create an <li> and remove link for each keyword
        else {
            words.innerHTML += "<li>" + keywords[i] + " <a href=''>[Remove]</a></li>";
        }
    }
    // Clear the textbox so users can enter more keywords
    document.getElementById('keywordSearch').value = '';
    // Send user's keywords to get some tweets!
    socket.emit('getTweets', keywords);

    console.log(keywords);

}

function getLocation(){
    geocoder = new google.maps.Geocoder();
    var locationInput = document.getElementById('locationSearch').value;
    geocoder.geocode( { 'address': locationInput}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      document.getElementById('alert').style.visibility = "hidden";
      map.setCenter(results[0].geometry.location);
    } else {
      document.getElementById('alert').style.visibility = "visible";
      document.getElementById('alert').innerHTML = badLocation;
    }
  });   
}

function checkRadius(lat, lng){
    // import geocoder
    geocoder = new google.maps.Geocoder();
    var locationInput = document.getElementById('locationSearch').value;
    geocoder.geocode( { 'address': locationInput}, function(results, status){
       
       var searchedLat = results[0].geometry.location.lb;
       var searchedLng = results[0].geometry.location.mb;

       // LatLng object for the search
       var searchedLocation = new google.maps.LatLng(searchedLat,searchedLng); 
       var tweetLocation = new google.maps.LatLng(lat,lng); 
       console.log('lat: ' + searchedLat + ' lng: ' + searchedLng + ' and... ' + lat + ',  ' + lng);
       // computeDistanceBetween returns distance in metres - so 100km = 100,000m
       if (google.maps.geometry.spherical.computeDistanceBetween(searchedLocation, tweetLocation) <= 100000){
            return true;
       }
       else{
            return false;
       }
       console.log(google.maps.geometry.spherical.computeDistanceBetween(searchedLocation, tweetLocation));
    });
}